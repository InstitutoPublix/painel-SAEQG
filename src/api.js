/* ============================================================
   SAEQG · camada de acesso ao backend (Supabase / Lovable Cloud)
   Leitura: tabelas com RLS; o servidor só devolve o que o usuário
   pode ver. Escrita: funções RPC e a Edge Function "usuarios".
   As telas continuam lendo das mesmas estruturas de antes
   (montadas em main.js a partir de carregaTudo).
   ============================================================ */
import { createClient } from '@supabase/supabase-js';

const URL_SUPABASE = import.meta.env.VITE_SUPABASE_URL;
const CHAVE_PUBLICA = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!URL_SUPABASE || !CHAVE_PUBLICA)
  console.error('SAEQG: defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY (ver .env.example).');

/* A sessão fica no sessionStorage, como na versão local: fechar a aba
   encerra o acesso, o que convém em computador compartilhado.          */
export const sb = createClient(URL_SUPABASE, CHAVE_PUBLICA, {
  auth: { storage: window.sessionStorage, persistSession: true, autoRefreshToken: true }
});

export const BUCKET = 'evidencias';
export const LIMITE_ANEXO = 25 * 1024 * 1024;   // igual ao file_size_limit do bucket

/* Mensagem legível para a tela. As funções do banco já levantam o texto
   em português; erro de rede vira o aviso de servidor fora do ar.      */
function erro(e) {
  const msg = (e && (e.message || e.error_description || e.erro)) || '';
  if (!msg || /fetch|network|Failed to/i.test(msg))
    return new Error('Não foi possível falar com o servidor. Tente novamente em instantes.');
  return new Error(msg);
}

async function rpc(nome, args) {
  const { data, error } = await sb.rpc(nome, args);
  if (error) throw erro(error);
  return data;
}

/* Lê a tabela inteira em páginas de 1000 linhas (limite do PostgREST). */
async function todas(tabela, ordem) {
  const PAG = 1000, linhas = [];
  for (let de = 0; ; de += PAG) {
    let q = sb.from(tabela).select('*');
    ordem.forEach(c => { q = q.order(c, { ascending: true }); });
    const { data, error } = await q.range(de, de + PAG - 1);
    if (error) throw erro(error);
    linhas.push(...data);
    if (data.length < PAG) return linhas;
  }
}

/* ---------------------------------------------------------------- acesso */

export async function orgaosPublicos() {
  return rpc('orgaos_publicos', {});
}

/* Login: Supabase Auth confere e-mail e senha; o banco confere se o
   usuário pode entrar pelo órgão escolhido. Devolve a forma que a tela
   de acesso já esperava: { ok, perfil, usuario:{ email, nivel } } ou
   { ok:false, erro }.                                                  */
export async function autenticar(orgao, email, senha) {
  if (!String(email || '').trim()) return { ok: false, erro: 'Informe o login.' };
  if (!senha) return { ok: false, erro: 'Informe a senha.' };
  const { error } = await sb.auth.signInWithPassword({ email: String(email).trim().toLowerCase(), password: senha });
  if (error) {
    if (error.status === 400 || /invalid/i.test(error.message)) return { ok: false, erro: 'Login ou senha inválidos.' };
    throw erro(error);
  }
  const r = await verificarAcesso(orgao);
  if (!r.ok) await sb.auth.signOut();
  return r;
}

export async function verificarAcesso(orgao) {
  return rpc('verificar_acesso', { p_orgao: orgao });
}

export async function sessaoAtiva() {
  const { data } = await sb.auth.getSession();
  return data.session || null;
}

export async function sair() {
  await sb.auth.signOut();
}

/* ---------------------------------------------------------------- leitura */

export async function carregaTudo() {
  const [orgaos, estudos, recomendacoes, acoes, evidencias, anexos, historico, usuarios, acessos] =
    await Promise.all([
      todas('orgaos', ['ordem', 'criado_em']),
      todas('estudos', ['ordem', 'criado_em']),
      todas('recomendacoes', ['numero']),
      todas('acoes', ['ordem', 'criado_em']),
      todas('evidencias', ['criado_em']),
      todas('anexos', ['criado_em']),
      todas('historico', ['em']),
      todas('usuarios', ['criado_em']),
      todas('usuario_acessos', ['org_id'])
    ]);
  return { orgaos, estudos, recomendacoes, acoes, evidencias, anexos, historico, usuarios, acessos };
}

/* ---------------------------------------------------------------- cadastro (coordenação) */

export const salvarOrgao = (id, d) =>
  rpc('salvar_orgao', { p_id: id || null, p_sigla: d.sigla, p_nome: d.nome, p_orgao: d.orgao });

export const salvarEstudo = (org, id, d) =>
  rpc('salvar_estudo', { p_org: org, p_id: id || null, p_nome: d.nome, p_programa: d.programa,
    p_acao: d.acao, p_resumo: d.resumo, p_focal_area: d.focalArea, p_focal_pessoa: d.focalPessoa,
    p_focal_email: d.focalEmail });

export const salvarRecomendacao = (org, pil, rid, d) =>
  rpc('salvar_recomendacao', { p_org: org, p_estudo: pil, p_rid: rid || null, p_titulo: d.titulo,
    p_chamada: d.chamada, p_icone: d.icone, p_paragrafos: d.paragrafos });

export const marcarItem = (chave, campos) => rpc('marcar_item', { p_chave: chave, p_campos: campos });

export async function apagarDefinitivo(chave) {
  const caminhos = await rpc('apagar_definitivo', { p_chave: chave });
  await removeArquivos(caminhos);
}

/* ---------------------------------------------------------------- ações */

export const criarAcao = (org, pil, rid, dados, prazo, recorrente) =>
  rpc('criar_acao', { p_org: org, p_estudo: pil, p_rid: rid, p_dados: dados,
    p_prazo: prazo || null, p_recorrente: !!recorrente });

export const editarAcao = (org, pil, codigo, campos) =>
  rpc('editar_acao', { p_org: org, p_estudo: pil, p_codigo: codigo, p_campos: campos });

/* Atualização da secretaria. Os anexos sobem primeiro para o Storage, na
   pasta da ação; se a gravação falhar, os arquivos enviados são removidos. */
export async function atualizarAcompanhamento(org, pil, codigo, valores, autor, evidencia, arquivos) {
  const enviados = [];
  try {
    if (evidencia) {
      evidencia = Object.assign({}, evidencia, { anexos: [] });
      for (const arq of arquivos || []) {
        if (arq.size > LIMITE_ANEXO)
          throw new Error('O arquivo "' + arq.name + '" passa do limite de 25 MB.');
        const caminho = [org, pil, codigo, crypto.randomUUID(), nomeSeguro(arq.name)].join('/');
        const { error } = await sb.storage.from(BUCKET).upload(caminho, arq, {
          contentType: arq.type || 'application/octet-stream', upsert: false });
        if (error) throw new Error('Falha ao enviar "' + arq.name + '": ' + error.message);
        enviados.push(caminho);
        evidencia.anexos.push({ nome: arq.name, tamanho: arq.size, tipo: arq.type, caminho });
      }
    }
    return await rpc('atualizar_acompanhamento', {
      p_org: org, p_estudo: pil, p_codigo: codigo,
      p_status: valores.status, p_progresso: parseInt(valores.progresso, 10) || 0,
      p_justificativa: valores.justificativa || '', p_autor: autor, p_evidencia: evidencia || null });
  } catch (e) {
    await removeArquivos(enviados).catch(() => {});
    throw erro(e);
  }
}

/* Secretaria ou gestor. Nome e motivo vão para o histórico da ação. */
export async function removerEvidencia(id, motivo, autor) {
  const caminhos = await rpc('remover_evidencia', { p_id: id, p_motivo: motivo, p_autor: autor });
  await removeArquivos(caminhos);
}

/* Link temporário (1 minuto) para baixar o anexo com o nome original. */
export async function linkAnexo(caminho, nome) {
  const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(caminho, 60, { download: nome || true });
  if (error) throw erro(error);
  return data.signedUrl;
}

async function removeArquivos(caminhos) {
  if (!caminhos || !caminhos.length) return;
  const { error } = await sb.storage.from(BUCKET).remove(caminhos);
  if (error) console.warn('SAEQG: anexos não removidos do Storage', caminhos, error);
}

/* Nome de arquivo aceito como chave no Storage: sem acento nem símbolo. */
function nomeSeguro(nome) {
  const s = String(nome || 'arquivo').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '');
  return (s || 'arquivo').slice(-120);
}

/* ---------------------------------------------------------------- usuários (Edge Function) */

async function funcaoUsuarios(corpo) {
  const { data, error } = await sb.functions.invoke('usuarios', { body: corpo });
  if (error) {
    let det = null;
    try { det = await error.context.json(); } catch (e) { /* sem corpo */ }
    throw erro(det && det.erro ? { message: det.erro } : error);
  }
  if (!data || !data.ok) throw new Error((data && data.erro) || 'Não foi possível gravar o cadastro.');
  return data;
}

export const salvarUsuario = d => funcaoUsuarios(Object.assign({ acao: 'salvar' }, d));
export const excluirUsuario = id => funcaoUsuarios({ acao: 'excluir', id });
