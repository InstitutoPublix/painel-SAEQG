/* ============================================================
   1. CONFIGURACAO
   ============================================================ */

const PAPEL = {
  orgao: { rotulo:'Acompanhar', eyebrow:'Órgão participante' },
  sefa:  { rotulo:'Consolidar', eyebrow:'SEFA · Coordenação do programa' }
};

/* Perfis cujo piloto ainda nao entra no sistema. A area aparece como em
   construcao mesmo que o conteudo ja esteja carregado na secao 2: basta
   retirar a sigla desta lista para liberar o acesso.                      */
const EM_CONSTRUCAO = [];

/* Recorte desta instalacao. Vazio significa o sistema inteiro. Preenchido,
   so os orgaos listados ficam navegaveis e todos os demais aparecem como em
   construcao, inclusive a coordenacao da SEFA. E o unico ponto a mexer para
   gerar uma versao de uma secretaria so.                                   */
const SO_ESTES = [];

/* Orgao fora do ar nesta instalacao, pelo recorte ou pela lista de obra. */
const foraDoAr = id =>
  SO_ESTES.length ? SO_ESTES.indexOf(id) < 0 : EM_CONSTRUCAO.indexOf(id) >= 0;

/* Itens do menu lateral. A chave id vira a rota (hash) da pagina.
   A aba Evidências saiu por decisão do usuário: a evidência passou a viver
   dentro da ação, no Plano de Ação, e não em tela própria.
   A coordenação da SEFA tem menu proprio: ela nao acompanha um estudo, ela
   acompanha todos, em leitura, e mantem o cadastro em Configuracoes.     */
const MENU_ORGAO = [
  { id:'inicio',        rotulo:'Início',         icone:'home' },
  { id:'recomendacoes', rotulo:'Recomendações',  icone:'lista' },
  { id:'planos',        rotulo:'Plano de Ação',  icone:'plano' }
];
const MENU_SEFA = [
  { id:'inicio',        rotulo:'Visão geral',        icone:'home' },
  { id:'estudos',       rotulo:'Estudos',            icone:'doc' },
  { id:'entregas',      rotulo:'Próximas entregas',  icone:'agenda' },
  { id:'config',        rotulo:'Configurações',      icone:'ajustes' }
];
const menuAtual = () =>
  (state.perfil && state.perfil.tipo === 'sefa' && !foraDoAr(state.perfil.id))
    ? MENU_SEFA : MENU_ORGAO;

/* Icones (Lucide). Somente o conteudo interno do SVG 24x24. */
const ICONES = {
  home:     '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  lista:    '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  plano:    '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  clipe:    '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  grafico:  '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  seta:     '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  relogio:  '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  aberto:   '<circle cx="12" cy="12" r="10" stroke-dasharray="4 3.4"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>',
  ok:       '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  alerta:   '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  info:     '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  usuarios: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  ajustes:  '<path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  doc:      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  pausa:    '<circle cx="12" cy="12" r="10"/><path d="M10 15V9"/><path d="M14 15V9"/>',
  agenda:   '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  mais:     '<path d="M5 12h14"/><path d="M12 5v14"/>',
  lixeira:  '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  arquivo:  '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M9 15h6"/><path d="M9 11h2"/>',
  moeda:    '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
  folha:    '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  alvo:     '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  gota:     '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C10 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  raio:     '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  busca:    '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  olho:     '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
  olhoOff:  '<path d="M10.73 5.08a10.74 10.74 0 0 1 11.21 6.57 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-1.45 2.49"/><path d="M14.08 14.16a3 3 0 0 1-4.24-4.25"/><path d="M17.48 17.5a10.75 10.75 0 0 1-15.42-5.15 1 1 0 0 1 0-.7 10.75 10.75 0 0 1 4.45-5.14"/><path d="m2 2 20 20"/>',
  obras:    '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/>',
  base:     '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  fechar:   '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  lapis:    '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  historico:'<path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>',
  repetir:  '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  arquivar: '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  desfazer: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  esq:      '<path d="m15 18-6-6 6-6"/>',
  dir:      '<path d="m9 18 6-6-6-6"/>'
};
const svg = (nome, classe) =>
  '<svg class="' + (classe || 'icon') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONES[nome] || '') + '</svg>';

/* ============================================================
   2b. MODELO DO PROGRAMA: ORGAOS, PILOTOS E RECOMENDACOES
   A base dos relatorios e tudo o que a coordenacao cadastra vivem no
   banco (Supabase). Na entrada e a cada tela o sistema carrega o que o
   usuario pode ver (as regras de acesso sao do servidor) e monta em DB
   as mesmas estruturas que as telas ja liam. As gravacoes vao ao
   servidor pelas funcoes de src/api.js e, em seguida, DB e recarregado.
   ============================================================ */
import * as srv from './api.js';

/* Prefixo das chaves que ficam no navegador: so conveniencias de quem le
   (tamanho do texto, orgao e estudo abertos nesta aba).                 */
const PRE = 'saeqgf.';

/* Dados carregados do servidor, nas formas que as telas usam.
     publicos  orgaos da tela de acesso (antes do login)
     orgaos    [{ id, sigla, nome, orgao, tipo, criado, apagado, apagadoEm }]
     estudos   { org: [piloto] }
     recs      { 'org|pil': [recomendacao com acoes] }
     estado    { 'org|pil': { codigo: { status, prazo, progresso, justificativa, evidencias, historico } } }
     marcas    { 'org|pil|codigo': { apagado, apagadoEm, arquivado, arquivadoEm } }
     usuarios  [{ id, email, nivel, acessos, criadoEm }] (so o gestor recebe a lista)
     evPorId   { id da evidencia: evidencia } (as que existem, para o historico)
     remocoes  { id da evidencia: registro de remocao do historico }       */
const DB = { publicos:[], orgaos:[], estudos:{}, recs:{}, estado:{}, marcas:{}, usuarios:[],
             evPorId:{}, remocoes:{} };

async function carregaPublicos(){
  DB.publicos = (await srv.orgaosPublicos()).map(o => ({
    id:o.id, sigla:o.sigla, nome:o.nome, orgao:o.orgao, tipo:o.tipo, noAr:!!o.no_ar }));
}

async function recarrega(){
  const b = await srv.carregaTudo();
  const k2 = (o, p) => o + '|' + p, k3 = (o, p, c) => o + '|' + p + '|' + c;

  DB.orgaos = b.orgaos.map(o => ({ id:o.id, sigla:o.sigla, nome:o.nome, orgao:o.orgao, tipo:o.tipo,
    criado:!o.do_relatorio, apagado:o.apagado, apagadoEm:o.apagado_em }));

  DB.estudos = {};
  b.estudos.forEach(e => (DB.estudos[e.org_id] = DB.estudos[e.org_id] || []).push({
    id:e.id, nome:e.nome, programa:e.programa, acao:e.acao, resumo:e.resumo || [],
    rotuloBloco:e.rotulo_bloco || undefined, rotuloPlural:e.rotulo_plural || undefined,
    focalArea:e.focal_area, focalPessoa:e.focal_pessoa, focalEmail:e.focal_email,
    doRelatorio:e.do_relatorio, criado:!e.do_relatorio, oculto:e.oculto,
    arquivado:e.arquivado, arquivadoEm:e.arquivado_em, apagado:e.apagado, apagadoEm:e.apagado_em }));

  DB.recs = {};
  const porRid = {};
  b.recomendacoes.forEach(r => {
    const rec = { rid:r.rid, numero:r.numero, titulo:r.titulo, chamada:r.chamada, icone:r.icone,
      cor:r.cor || undefined, fonte:r.fonte || undefined, quadro:r.quadro || undefined,
      paragrafos:r.paragrafos || [], status:'nao_iniciada',
      doRelatorio:r.do_relatorio, criada:!r.do_relatorio,
      arquivado:r.arquivado, arquivadoEm:r.arquivado_em, apagado:r.apagado, apagadoEm:r.apagado_em,
      _org:r.org_id, _pil:r.estudo_id, acoes:[] };
    (DB.recs[k2(r.org_id, r.estudo_id)] = DB.recs[k2(r.org_id, r.estudo_id)] || []).push(rec);
    porRid[k3(r.org_id, r.estudo_id, r.rid)] = rec;
  });

  /* A ficha (texto vigente) fica na acao; o acompanhamento, no estado. */
  DB.estado = {}; DB.marcas = {};
  b.acoes.forEach(x => {
    const rec = porRid[k3(x.org_id, x.estudo_id, x.rid)];
    if(!rec) return;
    rec.acoes.push({ codigo:x.codigo, rec:rec.numero, titulo:x.titulo, descricao:x.descricao,
      responsavel:x.responsavel, area:x.area, pessoa:x.pessoa, produto:x.produto, resultado:x.resultado,
      horizonte:x.horizonte || undefined, horizonteOriginal:x.horizonte_original || undefined,
      natureza:x.natureza || undefined, ciclo:x.ciclo || undefined,
      nova: x.origem !== 'relatorio', origem: x.origem === 'coordenacao' ? 'coordenacao' : undefined,
      status:'nao_iniciada' });
    const est = DB.estado[k2(x.org_id, x.estudo_id)] = DB.estado[k2(x.org_id, x.estudo_id)] || {};
    est[x.codigo] = { status:x.status, prazo:x.prazo || null, progresso:x.progresso,
      justificativa:x.justificativa, evidencias:[], historico:[] };
    DB.marcas[k3(x.org_id, x.estudo_id, x.codigo)] = { apagado:x.apagado, apagadoEm:x.apagado_em,
      arquivado:x.arquivado, arquivadoEm:x.arquivado_em };
  });
  const estadoDe = (o, p, c) => (DB.estado[k2(o, p)] || {})[c];

  const evs = {};
  b.evidencias.forEach(v => {
    const e = estadoDe(v.org_id, v.estudo_id, v.codigo);
    if(!e) return;
    const ev = { id:v.id, data:v.data, texto:v.texto, anexos:[] };
    e.evidencias.push(ev);
    evs[v.id] = ev;
  });
  b.anexos.forEach(x => { if(evs[x.evidencia_id])
    evs[x.evidencia_id].anexos.push({ nome:x.nome, tamanho:x.tamanho, tipo:x.tipo, caminho:x.caminho }); });
  /* evidenciaId liga o registro a evidencia que ele anexou (ou removeu):
     o historico mostra os anexos dela, para baixar, na propria atualizacao. */
  DB.evPorId = evs; DB.remocoes = {};
  b.historico.forEach(h => {
    const e = estadoDe(h.org_id, h.estudo_id, h.codigo);
    if(!e) return;
    const reg = { id:h.id, em:h.em, tipo:h.tipo, autor:h.autor, email:h.email,
                  campos:h.campos || undefined, mudancas:h.mudancas || [], evidenciaId:h.evidencia_id };
    e.historico.push(reg);
    if(reg.tipo === 'remocao' && reg.evidenciaId) DB.remocoes[reg.evidenciaId] = reg;
  });

  const acessos = {};
  b.acessos.forEach(a => {
    const u = acessos[a.usuario_id] = acessos[a.usuario_id] || {};
    (u[a.org_id] = u[a.org_id] || []).push(a.estudo_id);
  });
  DB.usuarios = b.usuarios.map(u => ({ id:u.id, email:u.email, nivel:u.nivel, criadoEm:u.criado_em,
    acessos: u.nivel === 'restrito' ? (acessos[u.id] || {}) : null }));
  cacheNum = {};
}

/* Tamanho do texto escolhido na barra superior. E conveniencia de quem le,
   por isso fica so no navegador dessa pessoa, mesmo depois do backend.   */
const TEXTOS = ['padrao', 'grande', 'maior'];
const NOME_TEXTO = { padrao:'padrão', grande:'grande', maior:'maior' };
function aplicaTexto(t){
  if(TEXTOS.indexOf(t) < 0) t = 'padrao';
  if(t === 'padrao') document.documentElement.removeAttribute('data-texto');
  else document.documentElement.setAttribute('data-texto', t);
  document.querySelectorAll('.tb-texto [data-texto]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.texto === t)));
  const c = document.getElementById('btn-texto-ciclo');
  if(c) c.title = 'Tamanho do texto: ' + NOME_TEXTO[t];
  return t;
}
function escolheTexto(t){
  t = aplicaTexto(t);
  try{ localStorage.setItem(PRE + 'texto', t); }catch(e){}
}
const textoAtual = () => document.documentElement.getAttribute('data-texto') || 'padrao';
(function(){
  let t = null;
  try{ t = localStorage.getItem(PRE + 'texto'); }catch(e){}
  aplicaTexto(t);
})();

/* Numeracao exibida, calculada por estudo e guardada ate a proxima gravacao
   ou a proxima tela (ver numeracao, na secao das acoes).                   */
let cacheNum = {};

/* ---- cadastros de acesso -----------------------------------------------
   Usuarios cadastrados pela coordenacao em Configuracoes > Cadastros. A
   conta (e-mail e senha) fica no Supabase Auth e o nivel no banco:
   'gestor' entra pela coordenacao (SEFA) ou por qualquer secretaria, e
   alterna entre elas pela barra lateral; 'restrito' entra so
   nas secretarias e nos estudos de acessos, no formato { orgao: [ids] }.
   Criar, alterar e excluir passa pela Edge Function "usuarios".        */
const leUsuarios    = () => DB.usuarios;
const normEmail     = v => String(v || '').trim().toLowerCase();
const temCadastro   = () => leUsuarios().length > 0;
const emailValido   = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
/* Regra da senha: ao menos 6 caracteres, uma letra maiuscula e um caractere
   especial (o que nao e letra, numero nem espaco). Devolve o que falta.
   O servidor confere a mesma regra.                                       */
const REGRA_SENHA = 'Mínimo de 6 caracteres, com ao menos uma letra maiúscula e um caractere especial';
function faltaNaSenha(s){
  const falta = [];
  if(String(s).length < 6)        falta.push('ao menos 6 caracteres');
  if(!/\p{Lu}/u.test(s))          falta.push('uma letra maiúscula');
  if(!/[^\p{L}\p{N}\s]/u.test(s)) falta.push('um caractere especial (como ! @ # $ % *)');
  return falta.length ? 'A senha precisa ter ' + falta.join(', ').replace(/, ([^,]*)$/, ' e $1') + '.' : '';
}
/* Estudos que o usuario restrito ve num orgao: os da lista que ainda existem. */
const estudosPermitidos = (u, orgaoId) =>
  ((u && u.acessos && u.acessos[orgaoId]) || []).filter(id => pilotoPorId(orgaoId, id));

/* ---- ciclo de vida dos cadastros ----------------------------------------
   Secretaria, estudo, recomendacao e acao podem ser excluidos: o item some
   de todas as telas e vai para a aba Apagados de Configuracoes (campo
   apagado), de onde volta com Restaurar. Apagar definitivamente remove do
   banco o item e tudo o que depende dele.
   O estudo tem ainda dois estados proprios: fora do ar (oculto, em
   preparacao, a secretaria ve "em construcao") e arquivado (encerrado: sai
   do acompanhamento e fica so para consulta).                            */

/* ---- orgaos -----------------------------------------------------------
   orgaosTodos inclui os que estao em Apagados; orgaos so os que estao em uso. */
const orgaosTodos = () => DB.orgaos;
function orgaos(){
  return orgaosTodos().filter(o => !o.apagado);
}
const orgaoPorId = id => orgaosTodos().filter(p => p.id === id)[0] || null;

/* ---- pilotos (Estudos da Qualidade do Gasto) ---------------------------
   Na interface o termo e "Estudo da Qualidade do Gasto". No codigo ficou o
   nome curto piloto nos identificadores, que nao aparecem em tela.
   O estudo do relatorio de cada orgao tem o id p1. pilotosTodos inclui os
   apagados; pilotos(o, true) inclui os fora do ar; pilotos(o) e o que a
   secretaria ve. Arquivado entra nos dois, porque continua disponivel para
   consulta. O usuario restrito so recebe do servidor os estudos liberados
   no cadastro dele.                                                      */
const pilotosTodos = orgaoId => DB.estudos[orgaoId] || [];
function pilotos(orgaoId, comOcultos){
  const vivos = pilotosTodos(orgaoId).filter(p => !p.apagado);
  return comOcultos ? vivos : vivos.filter(p => !p.oculto);
}
const pilotoPorId = (o, p) => pilotosTodos(o).filter(x => x.id === p)[0] || null;

/* ---- recomendacoes ----------------------------------------------------
   Por estudo, na chave "orgao|piloto". recomendacoesTodas inclui as que
   estao em Apagados. Cada recomendacao leva o orgao e o estudo de onde veio
   (_org e _pil), para as acoes dela serem lidas no lugar certo mesmo quando
   quem le e a coordenacao. Recomendacao arquivada (campo arquivado)
   continua na lista: quem a exibe decide como.                          */
const chaveRec = (o, p) => o + '|' + p;
const recomendacoesTodas = (orgaoId, pilotoId) => DB.recs[chaveRec(orgaoId, pilotoId)] || [];
function recomendacoes(orgaoId, pilotoId){
  return recomendacoesTodas(orgaoId, pilotoId).filter(r => !r.apagado);
}

/* Piloto que o perfil esta observando. Com mais de um estudo no orgao a
   escolha e da secretaria, na tela Inicio, e vale para o sistema inteiro.
   Sem escolha feita, vale o primeiro estudo em andamento; o arquivado so
   abre direto quando e o unico.                                          */
function pilotoAtual(orgaoId){
  const ps = pilotos(orgaoId);
  if(!ps.length) return null;
  const meu = (state.perfil && state.perfil.id === orgaoId) ? state.piloto : null;
  return ps.filter(p => p.id === meu)[0] || ps.filter(p => !p.arquivado)[0] || ps[0];
}
/* Estudo arquivado aberto pela secretaria: tudo vira consulta. */
const arquivadoAberto = () =>
  !!(state.perfil && state.perfil.tipo !== 'sefa' && (pilotoAtual(state.perfil.id) || {}).arquivado);

/* Conteudo vigente de um perfil: o estudo observado e as suas recomendacoes.
   As telas continuam lendo daqui e nao precisam saber da configuracao.    */
function conteudoDe(id){
  const p = pilotoAtual(id);
  if(!p) return null;
  return { piloto:p, recomendacoes: recomendacoes(id, p.id),
           rotuloBloco:p.rotuloBloco, rotuloPlural:p.rotuloPlural };
}

/* ============================================================
   3. CAMADA DE DADOS
   Os contadores sao derivados dos dados ja carregados do servidor
   (DB), com as mesmas regras de antes.
   ============================================================ */
const API = {
  async _get(rota, perfil){ return CALCULOS[rota](perfil); },
  resumo:     perfil => API._get('/resumo', perfil),
  pendencias: perfil => API._get('/pendencias', perfil),
  /* Visao da coordenacao: todos os estudos no ar, com o registro vigente de
     cada acao, na forma descrita em consolida(), na secao 5B.             */
  consolidado: perfil => API._get('/consolidado', perfil)
};

const CALCULOS = {
  /* Recomendacao arquivada saiu do acompanhamento: nao entra nos contadores,
     mas continua visivel para consulta.                                   */
  '/resumo': perfil => {
    const recs = ((conteudoDe(perfil.id) || {}).recomendacoes || []).filter(r => !r.arquivado);
    const est  = leEstado(perfil.id);
    const sit  = recs.map(r => statusRecomendacao(r, est, perfil.id));
    const conta = s => sit.filter(x => x === s).length;
    return {
      recomendacoes: recs.length,
      naoIniciadas:  conta('nao_iniciada'),
      emAndamento:   conta('em_andamento'),
      concluidas:    conta('concluida'),
      atrasadas:     conta('atrasada')
    };
  },
  /* O contador de acoes concluidas sem evidencia continua aqui, lido no
     resumo do plano e no selo do proprio cartao.                           */
  '/pendencias': perfil => {
    const recs = ((conteudoDe(perfil.id) || {}).recomendacoes || []).filter(r => !r.arquivado);
    const est  = leEstado(perfil.id);
    let semEvidencia = 0;
    recs.forEach(r => acoesDaRec(r, perfil.id).forEach(a => {
      const e = est[a.codigo];
      if(acaoStatus(a, e) === 'concluida' && !evidenciasDe(e).length) semEvidencia++;
    }));
    return { evidencias: semEvidencia };
  },
  '/consolidado': () => consolida()
};

/* Cor de identidade de cada recomendacao, na ordem em que aparecem.
   Uma recomendacao pode fixar a sua com o campo cor. O vermelho fica
   reservado para o status atrasada, para nao competir com a leitura. */
const CORES_REC = ['214 72% 44%', '147 67% 37%', '40 82% 50%', '194 85% 38%', '262 60% 52%', '18 78% 50%'];
const corRec = (r, k) => r.cor || CORES_REC[k % CORES_REC.length];

/* Status agregado de uma recomendacao, mostrado na tela Inicio. */

const STATUS = {
  nao_iniciada: { rotulo:'Não iniciada', cor:'tx-info',  fundo:'bg-info',  icone:'aberto' },
  em_andamento: { rotulo:'Em andamento', cor:'tx-gold',  fundo:'bg-gold',  icone:'relogio' },
  concluida:    { rotulo:'Concluída',    cor:'tx-green', fundo:'bg-green', icone:'ok' },
  atrasada:     { rotulo:'Atrasada',     cor:'tx-red',   fundo:'bg-red',   icone:'alerta' }
};

/* Situacao de cada acao do plano. O atraso nao e situacao: e uma condicao
   derivada do prazo pactuado, por isso aparece como marcador e nao como coluna. */
const STATUS_ACAO = {
  nao_iniciada: { rotulo:'Não iniciada',         icone:'aberto' },
  em_execucao:  { rotulo:'Em execução',          icone:'relogio' },
  aguardando:   { rotulo:'Aguardando terceiros', icone:'pausa' },
  concluida:    { rotulo:'Concluída',            icone:'ok' }
};

/* ---- estado das acoes (prazo e situacao) --------------------------------
   O plano de acao pertence ao estudo, e nao ao orgao: dois pilotos do mesmo
   orgao podem ter uma acao 1.1 cada um. Por isso a chave traz os dois.    */

/* Estudo alvo das janelas de acao. A secretaria edita o proprio plano; a
   coordenacao, na aba Acoes de Configuracoes, edita o de qualquer estudo,
   e para isso aponta state.alvo = { org, pil, rec } enquanto a janela esta
   aberta. Sem alvo, vale o perfil e o estudo que ele observa.            */
const orgAlvo = () => state.alvo ? state.alvo.org : (state.perfil && state.perfil.id);
const pilAlvo = () => state.alvo ? state.alvo.pil : undefined;
const pilDe   = (id, pil) => pil || (pilotoAtual(id) || {}).id || 'p1';

function leEstado(id, pil){
  if(!id){ id = orgAlvo(); pil = pil || pilAlvo(); }
  return DB.estado[chaveRec(id, pilDe(id, pil))] || {};
}

/* Remove uma evidencia (e os arquivos dela). O servidor registra no
   historico da acao quem removeu, o motivo e o que foi removido.       */
async function removeEvidencia(id, motivo, autor){
  await srv.removerEvidencia(id, motivo, autor);
  await recarrega();
}

/* Botao de remover e o pedido de nome e motivo, aberto ali mesmo no item
   da lista. Vale para a secretaria (janela de atualizacao) e para o gestor
   (ficha da acao). Nao redesenha a janela ao abrir, para nao perder o que
   ja foi digitado nela.                                                  */
const btnRemoverEv = id =>
  '<button type="button" class="ev-remover" data-tirarev="' + esc(id) + '" title="Remover evidência">' +
    svg('lixeira') + '</button>';

const formRemocaoEv = () =>
  '<div class="ev-rem">' +
    '<p class="mo-aviso">' + svg('alerta') + '<span>A evidência e os anexos saem do sistema. A remoção fica ' +
      'registrada no histórico da ação, com o nome, o e-mail do login e o motivo.</span></p>' +
    '<label class="campo cresce"><span>Nome <em class="obrig">(obrigatório)</em></span>' +
      '<input type="text" name="r_autor" autocomplete="name" placeholder="Seu nome completo"></label>' +
    '<label class="campo cresce"><span>Motivo da remoção <em class="obrig">(obrigatório)</em></span>' +
      '<textarea name="r_motivo" rows="2" placeholder="Por exemplo: arquivo errado, documento com dados pessoais"></textarea></label>' +
    '<p class="mo-erro" hidden></p>' +
    '<div class="ev-rem-botoes">' +
      '<button type="button" class="btn-neutro" data-remcancela="1">Cancelar</button>' +
      '<button type="button" class="btn-perigo" data-remconfirma="1">' + svg('lixeira') + 'Remover evidência</button>' +
    '</div>' +
  '</div>';

function ligaRemocaoEvidencia(box, depois){
  box.querySelectorAll('[data-tirarev]').forEach(b =>
    b.addEventListener('click', () => {
      const corpo = b.closest('.ev-item').querySelector('.ev-corpo');
      corpo.insertAdjacentHTML('beforeend', formRemocaoEv());
      const f = corpo.querySelector('.ev-rem');
      const erro = f.querySelector('.mo-erro');
      b.hidden = true;
      f.querySelector('[name="r_autor"]').focus();
      f.querySelector('[data-remcancela]').addEventListener('click', () => { f.remove(); b.hidden = false; });
      const ok = f.querySelector('[data-remconfirma]');
      ok.addEventListener('click', async () => {
        const autor  = f.querySelector('[name="r_autor"]').value.trim();
        const motivo = f.querySelector('[name="r_motivo"]').value.trim();
        const falta = !autor ? ['Informe o seu nome.', 'r_autor']
                    : !motivo ? ['Informe o motivo da remoção.', 'r_motivo'] : null;
        if(falta){
          erro.textContent = falta[0]; erro.hidden = false;
          f.querySelector('[name="' + falta[1] + '"]').focus();
          return;
        }
        if(await gravando(ok, () => removeEvidencia(b.dataset.tirarev, motivo, autor))) depois();
      });
    }));
}
const evidenciasDe = e => (e && e.evidencias) || [];

/* ---- ficha editavel da acao -------------------------------------------
   A ficha de cada acao vem do relatorio final (carga inicial do banco) e a
   coordenacao pode reescreve-la; o acompanhamento e da secretaria. A ficha
   declara os campos uma unica vez: a janela de edicao, o cartao e o
   historico leem todos desta mesma lista (o servidor usa os mesmos rotulos). */
const CAMPOS_ACAO = [
  { id:'titulo',        rotulo:'Título da ação',                 tipo:'area',  origem:true, linhas:2,
    dica:'O que será feito' },
  { id:'descricao',     rotulo:'Descrição',                      tipo:'area',  origem:true, linhas:3,
    dica:'Detalhamento da ação, escopo e forma de execução.' },
  { id:'responsavel',   rotulo:'Responsável (unidade ou órgão)', tipo:'texto', origem:true,
    dica:'Unidade ou órgão responsável pela ação' },
  { id:'area',          rotulo:'Área responsável',               tipo:'texto',
    dica:'Departamento, coordenação ou divisão' },
  { id:'pessoa',        rotulo:'Pessoa responsável',             tipo:'texto',
    dica:'Nome de quem conduz a ação' },
  { id:'produto',       rotulo:'Produto esperado',               tipo:'area',  origem:true, linhas:2,
    dica:'Entregável que comprova a conclusão' },
  { id:'resultado',     rotulo:'Resultado esperado',             tipo:'area',  origem:true, linhas:2,
    dica:'O que passa a acontecer com o produto em uso' },
  { id:'status',        rotulo:'Situação',                       tipo:'status' },
  { id:'prazo',         rotulo:'Prazo pactuado',                 tipo:'data' },
  { id:'progresso',     rotulo:'Progresso',                      tipo:'percentual' },
  { id:'justificativa', rotulo:'Justificativa',                  tipo:'area', linhas:3,
    dica:'Por que a ação está nesta situação.' }
];
const campoPorId  = id => CAMPOS_ACAO.filter(c => c.id === id)[0] || { id:id, rotulo:id, tipo:'texto' };
const rotuloCampo = id => campoPorId(id).rotulo;

/* O texto dos relatorios ja vem com entidades HTML escritas (M&amp;A), por
   isso o & nao e reescapado aqui: seria escapa-lo duas vezes.             */
const esc = v => (v === null || v === undefined ? '' : String(v))
  .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Regra de exibicao de campo sem valor: em toda a interface o vazio aparece
   como "A definir", para que a ficha nunca esconda o que falta preencher. O
   percentual e a unica excecao, porque zero por cento ja e informacao.     */
const A_DEFINIR = '<span class="vazio">A definir</span>';
const ouDefinir = v =>
  (v === null || v === undefined || String(v).trim() === '') ? A_DEFINIR : v;

/* Ponto focal para acompanhamento: area, pessoa e e-mail institucional,
   cadastrados pela SEFA no estudo (Configuracoes). Serve ao piloto e ao
   estudo do consolidado; comEmail acrescenta o e-mail quando existe.      */
const pontoFocal = (p, comEmail) => (p.focalArea || p.focalPessoa)
  ? ouDefinir(esc(p.focalArea)) + ' · ' + ouDefinir(esc(p.focalPessoa)) +
    (comEmail && p.focalEmail ? ' · ' + esc(p.focalEmail) : '')
  : A_DEFINIR;

/* Progresso em inteiro de 0 a 100. Acao concluida sem numero digitado vale
   100, para o cartao nao anunciar 0% no que ja terminou.                   */
function progressoAcao(a, e){
  const v = e && e.progresso;
  if(v === undefined || v === null || v === '')
    return acaoStatus(a, e) === 'concluida' ? 100 : 0;
  return Math.max(0, Math.min(100, parseInt(v, 10) || 0));
}

/* Valor vigente de um campo: o que o orgao escreveu, se escreveu; senao o
   que veio do relatorio. Campo em branco e escolha do orgao, nao ausencia. */
function valorCampo(a, e, campo){
  if(campo === 'status')    return acaoStatus(a, e);
  if(campo === 'progresso') return progressoAcao(a, e);
  const sobre = e && e[campo];
  if(sobre !== undefined && sobre !== null) return sobre;
  return (a && a[campo]) || '';
}

/* Localiza a acao pelo codigo em todas as recomendacoes do estudo: o do
   alvo, quando a coordenacao edita, ou o que o perfil observa.          */
function acaoPorCodigo(codigo){
  const recs = state.alvo ? recomendacoes(state.alvo.org, state.alvo.pil)
                          : (conteudoDe(state.perfil && state.perfil.id) || {}).recomendacoes || [];
  /* Procura tambem nas arquivadas, para a consulta do historico delas. */
  for(let i = 0; i < recs.length; i++){
    const achada = acoesDaRec(recs[i]).concat(acoesArquivadasDaRec(recs[i])).filter(x => x.codigo === codigo)[0];
    if(achada) return achada;
  }
  return null;
}

const historicoDe = e => (e && e.historico) || [];
const dataHoraBR = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' às ' +
         d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
};
const isoHoje = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/* Um valor de campo escrito para leitura humana, usado no historico. */
function mostraValor(campo, v){
  if(v === '' || v === null || v === undefined) return A_DEFINIR;
  if(campo === 'status')    return (STATUS_ACAO[v] || {}).rotulo || v;
  if(campo === 'prazo')     return dataBR(v);
  if(campo === 'progresso') return v + '%';
  return esc(v);
}

/* Grava a janela de edicao. Na secretaria, a atualizacao do acompanhamento
   (situacao, progresso, justificativa e evidencia com anexos) vai ao
   servidor, que guarda no historico a data, a hora, o e-mail do login, o
   que mudou e a propria janela como foi salva. Na coordenacao (state.alvo)
   e a edicao estrutural da ficha e do prazo, que o servidor tambem registra
   no historico, como edicao pela coordenacao.                           */
async function salvaEdicaoAcao(codigo, a, valores, autor, evidencia, arquivos){
  const org = orgAlvo(), pil = pilDe(org, pilAlvo());
  if(state.alvo){
    const campos = {};
    ['titulo', 'descricao', 'responsavel', 'area', 'pessoa', 'produto', 'resultado', 'prazo']
      .forEach(c => { if(valores[c] !== undefined) campos[c] = valores[c]; });
    await srv.editarAcao(org, pil, codigo, campos);
  } else {
    await srv.atualizarAcompanhamento(org, pil, codigo, valores, autor, evidencia, arquivos);
  }
}

/* ---- marcas das acoes ----------------------------------------------------
   As acoes do relatorio e as criadas pela coordenacao vem do servidor na
   propria recomendacao. Acao excluida fica na aba Apagados (apagado) e acao
   arquivada sai do acompanhamento e fica so para consulta (arquivado).    */
const marcaAcao = (org, pil, codigo) => DB.marcas[org + '|' + pil + '|' + codigo] || {};
const acaoFora = (org, pil, codigo) => !!marcaAcao(org, pil, codigo).apagado;
const acaoArquivada = (org, pil, codigo) => !!marcaAcao(org, pil, codigo).arquivado;
/* Acoes de uma recomendacao, sem as apagadas e sem as arquivadas
   (comApagadas traz todas).                                              */
function acoesDaRec(rec, id, comApagadas){
  const todas = rec.acoes || [];
  return comApagadas || !rec._org ? todas
    : todas.filter(a => !acaoFora(rec._org, rec._pil, a.codigo) && !acaoArquivada(rec._org, rec._pil, a.codigo));
}
/* Acoes arquivadas de uma recomendacao, fora as que tambem estao em Apagados. */
function acoesArquivadasDaRec(rec){
  if(!rec || !rec._org) return [];
  return acoesDaRec(rec, null, true)
    .filter(a => acaoArquivada(rec._org, rec._pil, a.codigo) && !acaoFora(rec._org, rec._pil, a.codigo));
}
/* ---- numeracao automatica ------------------------------------------------
   O codigo interno da acao (a.codigo) e o numero interno da recomendacao
   (rec.numero) ficam fixos: sao a chave do que a secretaria registrou e do
   que a coordenacao marcou. O numero que aparece na tela e calculado: conta
   so as recomendacoes e as acoes ativas (nem arquivadas nem apagadas), na
   ordem do cadastro. Arquivar, excluir ou restaurar renumera as demais na
   hora. O que esta fora da contagem aparece sem numero.                    */
function numeracao(org, pil){
  if(!org) return { rec:{}, acao:{} };
  pil = pil || (pilotoAtual(org) || {}).id || 'p1';
  const k = org + '|' + pil;
  if(cacheNum[k]) return cacheNum[k];
  const n = { rec:{}, acao:{} };
  recomendacoes(org, pil).filter(r => !r.arquivado).forEach((r, i) => {
    n.rec[r.rid] = i + 1;
    acoesDaRec(r).forEach((a, j) => { n.acao[a.codigo] = (i + 1) + '.' + (j + 1); });
  });
  return (cacheNum[k] = n);
}
/* Numero exibido de uma recomendacao (nada, se arquivada ou apagada). */
const numRec = r => (r && r._org) ? (numeracao(r._org, r._pil).rec[r.rid] || null) : null;
/* Codigo exibido de uma acao. Sem orgao e estudo, vale o da tela aberta: o
   alvo da coordenacao ou o estudo que o perfil observa.                   */
function codAcao(codigo, org, pil){
  if(!org){ org = orgAlvo(); pil = pilAlvo(); }
  return numeracao(org, pil).acao[codigo] || '';
}
/* Etiqueta do codigo. Sem numero nao ha etiqueta; nas tabelas em grade fica
   uma celula vazia, para as colunas nao saltarem.                         */
const chipCod   = (c, estilo) => c ? '<span class="cod"' + (estilo || '') + '>' + c + '</span>' : '';
const chipGrade = c => c ? chipCod(c) : '<span></span>';

/* Uma atividade que se repete todo ano nao e uma acao com ciclos internos:
   sao acoes distintas, uma por exercicio, cada qual com o seu codigo, prazo,
   situacao e evidencias. O campo ciclo apenas marca o ano de referencia.     */
const ANO_LIMITE = 2030;
const selosCiclo = a => a.ciclo
  ? '<span class="badge b-ciclo">' + svg('repetir') + 'Ciclo ' + a.ciclo + '</span>' : '';
/* A justificativa acompanha qualquer situacao da acao, e nao so a espera por
   terceiros: em toda situacao o orgao registra por que a acao esta ali. O
   rotulo e sempre o mesmo, so o texto de apoio muda com a situacao. A falta
   continua sinalizada apenas em Aguardando terceiros, onde a explicacao e o
   que impede a coluna de virar deposito de acoes paradas sem motivo.         */
const APOIO_JUST = {
  nao_iniciada: 'Registre por que a ação ainda não começou e o que falta para iniciá-la.',
  em_execucao:  'Registre em que ponto a ação está e o que vem sendo executado.',
  aguardando:   'Descreva brevemente o que está sendo aguardado, de quem e desde quando.',
  concluida:    'Registre como a ação foi concluída e o que ficou entregue.'
};
function caixaJustificativa(a, e, compacto){
  const st  = acaoStatus(a, e);
  const txt = ((e && e.justificativa) || '').replace(/</g, '&lt;');
  if(compacto)
    return '<div class="kb-just"><div class="tit">Justificativa</div>' +
      '<p class="kb-just-txt">' + ouDefinir(txt) + '</p></div>';
  return '<div class="just">' +
    '<div class="just-tit">' + svg('doc') + 'Justificativa</div>' +
    '<p class="just-txt">' + ouDefinir(txt) + '</p>' +
    (!txt && st === 'aguardando'
      ? '<div class="falta">' + svg('alerta') + 'Justificativa ainda não registrada. ' +
        (APOIO_JUST[st] || APOIO_JUST.em_execucao) + '</div>' : '') +
  '</div>';
}

/* Evidencias em leitura. O registro fica na janela de edicao da secretaria;
   com remover, cada item traz o botao de remocao (ficha do gestor).      */
function listaEvidencias(evs, remover){
  if(!evs.length) return '<p class="ev-vazio">Nenhuma evidência registrada nesta ação.</p>';
  return '<ul class="ev-lista">' + evs.map(ev =>
    '<li class="ev-item"><span class="ic">' + svg('clipe') + '</span>' +
      '<div class="ev-corpo"><div class="ev-data">' + ouDefinir(dataBR(ev.data)) + '</div>' +
        '<p class="ev-texto">' + ouDefinir(String(ev.texto || '').replace(/</g, '&lt;')) + '</p>' +
        (ev.anexos && ev.anexos.length
          ? '<div class="ev-anexos">' + ev.anexos.map(chipAnexo).join('') + '</div>'
          : '') +
      '</div>' +
      (remover ? btnRemoverEv(ev.id) : '') +
    '</li>').join('') + '</ul>';
}

const hojeZero = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const acaoStatus = (a, e) => (e && e.status) || a.status || 'nao_iniciada';
function acaoAtrasada(a, e){
  if(!e || !e.prazo || acaoStatus(a, e) === 'concluida') return false;
  return new Date(e.prazo + 'T00:00:00') < hojeZero();
}
/* A situacao da recomendacao e derivada das suas acoes, nunca digitada. */
function statusRecomendacao(rec, est, perfilId){
  const acoes = acoesDaRec(rec, perfilId);
  if(!acoes.length) return rec.status || 'nao_iniciada';
  if(acoes.some(a => acaoAtrasada(a, est[a.codigo]))) return 'atrasada';
  const sts = acoes.map(a => acaoStatus(a, est[a.codigo]));
  if(sts.every(s => s === 'concluida'))    return 'concluida';
  if(sts.every(s => s === 'nao_iniciada')) return 'nao_iniciada';
  return 'em_andamento';
}
const dataBR = iso => iso ? new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR') : '';

/* ============================================================
   4. ESTADO E TELAS
   ============================================================ */
/* Cada relatorio nomeia os seus blocos de um jeito. A SEAB e a SEDEST tratam
   por recomendacao; a SESA organiza o plano por fase. O rotulo vem do conteudo. */
const conteudoAtual = () => (state.perfil && conteudoDe(state.perfil.id)) || {};
const rotBloco  = () => conteudoAtual().rotuloBloco  || 'Recomendação';
const rotPlural = () => conteudoAtual().rotuloPlural || 'recomendações';
const rotTitulo = () => { const p = rotPlural(); return p.charAt(0).toUpperCase() + p.slice(1); };

const state = { perfil:null, orgaoSel:null, pagina:'inicio', rec:0, vis:'lista', resumo:null, pendencias:null, modal:null,
                /* quem entrou: { email, nivel } (nivel nulo antes do primeiro cadastro) */
                usuario:null,
                piloto:null, cfg:'secretarias', cfgOrg:null, cfgPil:null, cfgRec:null, cfgUsuFiltro:'',
                /* estudo alvo da janela de acao quando quem edita e a coordenacao */
                alvo:null,
                /* coordenacao da SEFA: dados consolidados, estudo aberto, visao e
                   filtros de Proximas entregas e mes do calendario            */
                consol:null, sf:{ estudo:null, arq:false, vis:'lista', org:'', sit:'', per:'', q:'', mes:null },
                /* aviso do ultimo excluir, arquivar ou restaurar, com Desfazer */
                cfgAviso:null,
                /* acao escolhida no historico consolidado ('*' = todas) */
                histSel:null };
const $ = sel => document.querySelector(sel);


/* Orientacao no pe da tela de acesso, nas duas etapas. */
const AJUDA_ACESSO = 'Em caso de problemas de cadastro e acesso contactar a SEFA - Diretoria de ' +
  'Orçamento Estadual via e-mail ou telefone.';

/* A tela de acesso le a lista publica de orgaos (antes do login nao ha
   acesso aos dados). Sem servidor, mostra o aviso e tenta de novo.     */
async function renderLogin(){
  if(!DB.publicos.length){
    $('#login-passo').innerHTML = '<p class="login-hint">Carregando...</p>';
    try{ await carregaPublicos(); }
    catch(e){
      $('#login-passo').innerHTML = '<p class="login-erro">' + esc(e.message) + '</p>' +
        '<button type="button" class="btn-entrar" id="btn-tentar">Tentar novamente</button>';
      $('#btn-tentar').addEventListener('click', renderLogin);
      return;
    }
  }
  const p = state.orgaoSel && DB.publicos.filter(o => o.id === state.orgaoSel)[0];
  $('#login-passo').innerHTML = p ? passoCredenciais(p) : passoOrgao();
  p ? ligaCredenciais(p) : ligaEscolha();
}

/* Etapa 1: escolher o órgão. */
function passoOrgao(){
  return '<p class="login-hint">Selecione seu órgão</p>' +
    '<div class="profile-grid">' + DB.publicos.map(p => {
      /* A coordenação não acompanha um estudo, mas tem tela própria: o cartão
         dela nunca entra como em construção.                                */
      const noAr = !foraDoAr(p.id) && p.noAr;
      const cls = 'profile' + (p.tipo === 'sefa' ? ' is-sefa' : '') + (noAr ? '' : ' is-obra');
      return '<button class="' + cls + '" data-perfil="' + p.id + '">' +
               '<span class="sig">' + esc(p.sigla) + '</span>' +
               '<span class="nm">' + esc(p.nome) + '</span>' +
               '<span class="rl">' + (noAr ? PAPEL[p.tipo].rotulo : 'Em construção') + '</span>' +
             '</button>';
    }).join('') + '</div>' +
    '<p class="login-foot">' + AJUDA_ACESSO + '</p>';
}

/* Etapa 2: credenciais do órgão escolhido. */
function passoCredenciais(p){
  return '<button type="button" class="voltar" id="btn-voltar">Trocar de órgão</button>' +
    '<div class="orgao-sel' + (p.tipo === 'sefa' ? ' is-sefa' : '') + '">' +
      '<span class="sig">' + p.sigla + '</span>' +
      '<span><b>' + p.orgao + '</b><em>' + PAPEL[p.tipo].eyebrow + '</em></span>' +
    '</div>' +
    '<form class="login-form" id="form-login" novalidate>' +
      '<label class="campo-login"><span>Login</span>' +
        '<input type="text" name="usuario" id="in-usuario" required autocomplete="username" ' +
          'autocapitalize="none" spellcheck="false" placeholder="Seu e-mail de acesso"></label>' +
      '<label class="campo-login"><span>Senha</span>' +
        '<span class="senha-wrap">' +
          '<input type="password" name="senha" id="in-senha" required ' +
            'autocomplete="current-password" placeholder="Sua senha">' +
          '<button type="button" class="ver-senha" id="ver-senha" aria-label="Mostrar senha">' +
            svg('olho') + '</button>' +
        '</span></label>' +
      '<p class="login-erro" id="login-erro" hidden></p>' +
      '<button type="submit" class="btn-entrar" id="btn-entrar">Entrar</button>' +
    '</form>' +
    '<p class="login-foot">' + AJUDA_ACESSO + '</p>';
}

function ligaEscolha(){
  $('#login-passo').querySelectorAll('[data-perfil]').forEach(b =>
    b.addEventListener('click', () => { state.orgaoSel = b.dataset.perfil; renderLogin(); }));
}

function ligaCredenciais(p){
  $('#btn-voltar').addEventListener('click', () => { state.orgaoSel = null; renderLogin(); });

  $('#ver-senha').addEventListener('click', () => {
    const campo = $('#in-senha'), oculta = campo.type === 'password';
    campo.type = oculta ? 'text' : 'password';
    $('#ver-senha').innerHTML = svg(oculta ? 'olhoOff' : 'olho');
    $('#ver-senha').setAttribute('aria-label', oculta ? 'Ocultar senha' : 'Mostrar senha');
    campo.focus();
  });

  $('#form-login').addEventListener('submit', async ev => {
    ev.preventDefault();
    const btn = $('#btn-entrar'), erro = $('#login-erro');
    erro.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Entrando...';
    try{
      const r = await srv.autenticar(p.id, $('#in-usuario').value, $('#in-senha').value);
      if(!r || !r.ok){
        erro.textContent = (r && r.erro) || 'Não foi possível entrar.';
        erro.hidden = false;
        $('#in-senha').focus();
        return;
      }
      $('#in-senha').value = '';
      state.usuario = r.usuario || null;
      await entrar(r.perfil);
    }catch(e){
      erro.textContent = e.message || 'Não foi possível falar com o servidor. Tente novamente em instantes.';
      erro.hidden = false;
    }finally{
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });

  $('#in-usuario').focus();
}

async function entrar(id, rota){
  await recarrega();
  const p = orgaoPorId(id);
  if(!p || p.apagado) return;
  state.perfil = p;
  state.rec = 0;
  /* O estudo observado volta como estava, se ainda existir no orgao. */
  let pil = null;
  try{ pil = sessionStorage.getItem(PRE + 'piloto.' + id); }catch(e){}
  state.piloto = null;
  state.piloto = pilotos(id).some(x => x.id === pil) ? pil : (pilotoAtual(id) || {}).id || null;
  try{ sessionStorage.setItem(PRE + 'perfil', id); }catch(e){}
  [state.resumo, state.pendencias] = await Promise.all([API.resumo(p), API.pendencias(p)]);
  $('#screen-login').hidden = true;
  $('#screen-app').hidden = false;
  montaShell();
  navega(rota || location.hash.replace('#', '') || 'inicio', true);
}

/* O gestor alterna entre a coordenacao e as secretarias sem sair: o
   servidor confere o acesso ao orgao e a tela abre no Inicio dele.      */
const ehGestor = () => !!(state.usuario && state.usuario.nivel === 'gestor');
async function trocaOrgao(id){
  if(!state.perfil || id === state.perfil.id) return;
  fechaModal();
  try{
    const r = await srv.verificarAcesso(id);
    if(!r || !r.ok) throw new Error((r && r.erro) || 'Não foi possível abrir este órgão.');
    state.usuario = r.usuario || state.usuario;
    state.sf.estudo = null; state.sf.arq = false;
    await entrar(id, 'inicio');
  }catch(e){
    if(!(await sessaoValida())) return;
    mostraErro(e);
    montaShell();
  }
}

async function sair(){
  try{ sessionStorage.removeItem(PRE + 'perfil'); }catch(e){}
  fechaModal();
  state.perfil = null;
  state.usuario = null;
  try{ await srv.sair(); }catch(e){}
  Object.assign(DB, { orgaos:[], estudos:{}, recs:{}, estado:{}, marcas:{}, usuarios:[] });
  DB.publicos = [];
  document.body.classList.remove('nav-open');
  state.orgaoSel = null;
  $('#screen-app').hidden = true;
  $('#screen-login').hidden = false;
  renderLogin();
  location.hash = '';
}

function montaShell(){
  const p = state.perfil;
  $('#u-avatar').textContent   = p.sigla;
  $('#u-name').textContent     = p.sigla + (p.tipo === 'sefa' ? ' · Coordenação' : '');
  /* Com usuario identificado, o rodape da barra mostra o e-mail de quem
     entrou; o orgao continua na pilula do topo.                         */
  const email = state.usuario && state.usuario.email;
  $('#u-org').textContent      = email || p.orgao;
  $('#u-org').title            = email ? email + ' · ' + p.orgao : p.orgao;
  $('#pill-org').textContent   = p.orgao + ' (' + p.sigla + ')';
  $('#tb-eyebrow').textContent = PAPEL[p.tipo].eyebrow;

  /* Seletor de orgao, so para o gestor. */
  $('#sb-troca').hidden = !ehGestor();
  if(ehGestor())
    $('#sel-orgao').innerHTML = orgaos().map(o =>
      '<option value="' + o.id + '"' + (o.id === p.id ? ' selected' : '') + '>' +
      esc(o.sigla) + (o.tipo === 'sefa' ? ' · Coordenação' : ' · ' + esc(o.nome)) +
      (foraDoAr(o.id) ? ' (em construção)' : '') + '</option>').join('');

  $('#sb-nav').innerHTML = menuAtual().map(m =>
    '<button class="sb-item" data-rota="' + m.id + '">' + svg(m.icone) +
    '<span>' + (m.id === 'recomendacoes' ? rotTitulo() : m.rotulo) + '</span></button>').join('');
  /* Pelo menu, Estudos sempre abre na carteira, e nao no ultimo estudo visto. */
  $('#sb-nav').querySelectorAll('[data-rota]').forEach(b =>
    b.addEventListener('click', () => { state.sf.estudo = null; state.sf.arq = false; navega(b.dataset.rota); }));
}

/* A coordenacao le todos os estudos, ja com o resumo de cada um. */
async function atualizaConsolidado(){
  state.consol = await API.consolidado(state.perfil);
  state.consol.estudos.concat(state.consol.arquivados || []).forEach(s => { s.res = resumoEstudo(s); });
}

async function navega(rota, jaCarregado){
  cacheNum = {};
  if(!menuAtual().some(m => m.id === rota)) rota = 'inicio';
  if(state.modal) fechaModal();
  state.cfgAviso = null;
  state.pagina = rota;
  location.hash = rota;
  document.body.classList.remove('nav-open');
  const item = menuAtual().find(m => m.id === rota);
  $('#tb-title').textContent = item.id === 'recomendacoes' ? rotTitulo() : item.rotulo;
  $('#sb-nav').querySelectorAll('[data-rota]').forEach(b =>
    b.classList.toggle('active', b.dataset.rota === rota));
  /* Cada tela le o estado atual do servidor: outras pessoas podem ter
     atualizado o plano desde a ultima leitura.                         */
  if(!jaCarregado){
    try{ await recarrega(); }
    catch(e){ if(!(await sessaoValida())) return; mostraErro(e); }
  }
  if(!state.perfil) return;
  [state.resumo, state.pendencias] = await Promise.all([API.resumo(state.perfil), API.pendencias(state.perfil)]);
  if(ehCoordenacao()) await atualizaConsolidado();
  montaShell();
  $('#sb-nav').querySelectorAll('[data-rota]').forEach(b =>
    b.classList.toggle('active', b.dataset.rota === rota));
  desenhaPagina(item);
  window.scrollTo(0, 0);
}

function desenhaPagina(item){
  cacheNum = {};
  const conteudo = conteudoDe(state.perfil.id) || {};
  let html;
  if(item.id === 'config')                                       html = paginaConfig();
  else if(ehCoordenacao() && item.id === 'inicio')               html = paginaVisaoGeral();
  else if(ehCoordenacao() && item.id === 'estudos')              html = paginaEstudos();
  else if(ehCoordenacao() && item.id === 'entregas')             html = paginaEntregas();
  else if(!conteudo.recomendacoes)                               html = paginaVazia(item);
  else if(item.id === 'inicio')                                  html = paginaInicio(conteudo);
  else if(!conteudo.recomendacoes.length)                        html = paginaSemRecs(item);
  else if(item.id === 'recomendacoes')                           html = paginaRecomendacoes(conteudo);
  else if(item.id === 'planos')                                  html = paginaPlanos(conteudo);
  else                                                           html = paginaVazia(item);
  $('#page').innerHTML = html;
  ligaConfig(item);
  /* Trocar o estudo troca o conteudo de todas as telas, por isso recarrega
     os contadores do resumo em vez de so redesenhar a pagina.            */
  $('#page').querySelectorAll('[data-piloto]').forEach(el =>
    el.addEventListener('change', () => {
      state.piloto = el.value;
      state.rec = 0;
      try{ sessionStorage.setItem(PRE + 'piloto.' + state.perfil.id, el.value); }catch(e){}
      navega(state.pagina);
    }));
  $('#page').querySelectorAll('[data-ir]').forEach(b =>
    b.addEventListener('click', () => navega(b.dataset.ir)));
  $('#page').querySelectorAll('[data-rec]').forEach(b =>
    b.addEventListener('click', () => { state.rec = +b.dataset.rec; desenhaPagina(item); }));
  $('#page').querySelectorAll('[data-vis]').forEach(b =>
    b.addEventListener('click', () => { state.vis = b.dataset.vis; desenhaPagina(item); }));
  $('#page').querySelectorAll('[data-editar]').forEach(b =>
    b.addEventListener('click', ev => { ev.stopPropagation(); abreModal('edicao', b.dataset.editar); }));
  $('#page').querySelectorAll('[data-hist]').forEach(b =>
    b.addEventListener('click', () => abreModal('historico', b.dataset.hist)));
  $('#page').querySelectorAll('[data-histplano]').forEach(b =>
    b.addEventListener('click', () => abreModal('consolidado', null)));
  ligaAcoes(item);
  ligaSefa(item);
}

/* A secretaria nao cria nem remove acoes: isso e da coordenacao, na aba
   Acoes de Configuracoes.                                                */
function ligaAcoes(item){
  ligaArrastoRoadmap();
}

/* Arrastar a linha do tempo com o ponteiro, além da barra de rolagem. O
   arrasto só começa depois de alguns pixels, para não roubar o clique. */
function ligaArrastoRoadmap(){
  $('#page').querySelectorAll('.rm-rolagem.rola').forEach(faixa => {
    let ativo = false, movendo = false, x0 = 0, s0 = 0;
    faixa.addEventListener('pointerdown', ev => {
      if(ev.button !== 0) return;
      ativo = true; movendo = false;
      x0 = ev.clientX; s0 = faixa.scrollLeft;
    });
    faixa.addEventListener('pointermove', ev => {
      if(!ativo) return;
      const d = ev.clientX - x0;
      if(!movendo && Math.abs(d) < 5) return;
      if(!movendo){ movendo = true; faixa.classList.add('arrastando'); faixa.setPointerCapture(ev.pointerId); }
      faixa.scrollLeft = s0 - d;
    });
    const solta = () => { ativo = false; movendo = false; faixa.classList.remove('arrastando'); };
    faixa.addEventListener('pointerup', solta);
    faixa.addEventListener('pointercancel', solta);
    faixa.addEventListener('pointerleave', solta);
  });
}

/* Recomendacao em que a nova acao entra: a escolhida na aba Acoes, quando
   quem cria e a coordenacao, ou a aberta no Plano de Acao da secretaria. */
function recDaJanela(){
  if(state.alvo)
    return recomendacoes(state.alvo.org, state.alvo.pil).filter(r => r.numero === state.alvo.rec)[0];
  const recs = (conteudoDe(state.perfil.id) || {}).recomendacoes || [];
  return recs[recAtual(recs)];
}

/* Grava a acao criada pelo orgao, ou pela coordenacao, a partir da janela. */
/* O servidor numera as acoes (o sufixo conta tambem as apagadas e
   arquivadas) e, na recorrente, cria uma por exercicio ate ANO_LIMITE,
   com o prazo so na primeira. Devolve false quando falta o titulo.     */
async function criaAcaoDaJanela(f){
  const rec    = recDaJanela();
  const titulo = f.titulo.value.trim();
  if(!titulo){ f.titulo.focus(); return false; }
  const base = {
    titulo: titulo,
    descricao: f.descricao.value.trim(),
    responsavel: f.responsavel.value.trim(),
    area: f.area.value.trim(),
    pessoa: f.pessoa.value.trim(),
    produto: f.produto.value.trim(),
    resultado: f.resultado.value.trim()
  };
  await srv.criarAcao(rec._org, rec._pil, rec.rid, base, f.prazo.value || null, f.recorrente.checked);
  return true;
}

/* Sessao expirada ou encerrada em outra aba: volta para a tela de acesso. */
async function sessaoValida(){
  if(await srv.sessaoAtiva()) return true;
  await sair();
  return false;
}

/* ============================================================
   5. PAGINAS
   ============================================================ */
function dataPorExtenso(d){
  const t = d.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function paginaInicio(conteudo){
  const p = state.perfil, r = state.resumo || {};
  const pil = conteudo.piloto;

  const sobre = !pil ? '' :
    '<div class="card about" style="margin-top:26px">' +
      '<div class="about-head">' +
        '<span class="ic">' + svg('info') + '</span>' +
        '<div><h3>Sobre o estudo</h3><div class="prog">' + pil.programa + ' · ' + pil.acao + '</div></div>' +
      '</div>' +
      '<dl class="about-grid">' + (pil.resumo || []).map(function(bloco){
        return '<div><dt>' + bloco[0] + '</dt><dd>' + bloco[1] + '</dd></div>';
      }).join('') + '</dl>' +
    '</div>';

  /* Ponto focal para acompanhamento: bloco proprio, entre a explicacao do
     estudo e o status. Cadastrado pela SEFA no estudo.                   */
  const focal = !pil ? '' :
    '<div class="card about focal">' +
      '<div class="about-head">' +
        '<span class="ic">' + svg('usuarios') + '</span>' +
        '<div><h3>Ponto focal para acompanhamento</h3>' +
          '<div class="prog">Interlocutor da SEFA no acompanhamento deste estudo</div></div>' +
      '</div>' +
      '<dl class="about-grid focal-grid">' +
        '<div><dt>Área</dt><dd>' + ouDefinir(esc(pil.focalArea)) + '</dd></div>' +
        '<div><dt>Pessoa</dt><dd>' + ouDefinir(esc(pil.focalPessoa)) + '</dd></div>' +
        '<div><dt>E-mail institucional</dt><dd>' + (pil.focalEmail
          ? '<a href="mailto:' + esc(pil.focalEmail) + '">' + esc(pil.focalEmail) + '</a>' : A_DEFINIR) + '</dd></div>' +
      '</dl>' +
    '</div>';

  const status = [
    { k:'nao_iniciada', n:r.naoIniciadas, l:'Não iniciadas' },
    { k:'em_andamento', n:r.emAndamento,  l:'Em andamento' },
    { k:'concluida',    n:r.concluidas,   l:'Concluídas' },
    { k:'atrasada',     n:r.atrasadas,    l:'Atrasadas' }
  ];

  return '' +
    '<h1 class="page-hello">Bem-vindo, ' + p.orgao + ' (' + p.sigla + ')</h1>' +
    '<p class="page-date">' + dataPorExtenso(new Date()) + '</p>' +
    seletorPiloto() +
    sobre +
    focal +
    '<h2 class="section-label">Status das ' + rotPlural() + '</h2>' +
    '<div class="grid-4">' + status.map(s => {
      const st = STATUS[s.k];
      return '<div class="card st">' +
        '<span class="ic ' + st.fundo + '">' + svg(st.icone) + '</span>' +
        '<div><div class="n ' + st.cor + '">' + (s.n ?? 0) + '</div><div class="l">' + s.l + '</div></div>' +
      '</div>';
    }).join('') + '</div>';
}

/* Seletor do estudo observado. So aparece quando o orgao tem mais de um, e
   vale para o sistema inteiro: a recomendacao pertence a um estudo, entao
   trocar aqui troca tambem as Recomendacoes e o Plano de Acao. Quando o
   estudo aberto esta arquivado, o aviso de consulta vem logo abaixo.      */
function seletorPiloto(){
  const ps = pilotos(state.perfil.id);
  if(ps.length < 2) return notaArquivado();
  const atual = pilotoAtual(state.perfil.id) || {};
  return '<div class="pil-sel">' +
    '<label class="campo"><span>Estudo da Qualidade do Gasto observado</span>' +
      '<select data-piloto="1">' + ps.map(p =>
        '<option value="' + p.id + '"' + (p.id === atual.id ? ' selected' : '') + '>' +
        esc(p.nome) + (p.arquivado ? ' (arquivado)' : '') + '</option>').join('') + '</select></label>' +
    '<p class="pil-dica">' + svg('info') + 'A escolha vale para o Início, as ' +
      rotPlural() + ' e o Plano de Ação.</p>' +
  '</div>' + notaArquivado();
}
function notaArquivado(){
  if(!arquivadoAberto()) return '';
  const p = pilotoAtual(state.perfil.id) || {};
  return '<div class="pl-nota sf-arq-nota">' + svg('arquivar') +
    '<span><b>Estudo arquivado</b> pela coordenação' + (p.arquivadoEm ? ' em ' + diaDeIso(p.arquivadoEm) : '') +
    '. O plano continua disponível para consulta, sem edição.</span></div>';
}
/* Recomendacao arquivada aberta pela secretaria: as acoes dela viram consulta. */
function notaRecArquivada(rec){
  if(arquivadoAberto() || !rec || !rec.arquivado) return '';
  return '<div class="pl-nota sf-arq-nota">' + svg('arquivar') +
    '<span><b>' + rotBloco() + ' arquivada</b> pela coordenação' +
    (rec.arquivadoEm ? ' em ' + diaDeIso(rec.arquivadoEm) : '') +
    '. As ações dela continuam disponíveis para consulta, sem edição.</span></div>';
}
/* Tela da secretaria em modo consulta: estudo arquivado ou recomendacao
   aberta arquivada. A coordenacao, quando edita pela aba Acoes, nao passa
   por aqui (state.alvo).                                                 */
function soLeitura(){
  if(state.alvo) return false;
  if(arquivadoAberto()) return true;
  const recs = conteudoAtual().recomendacoes || [];
  return !!(recs.length && (recs[recAtual(recs)] || {}).arquivado);
}

/* Seletor de recomendacoes, usado igual nas telas Recomendacoes e Planos de Acao. */
function seletorRecs(recs, i){
  return '<div class="rec-sel">' + recs.map((r, k) =>
    '<button class="card rec-opt' + (k === i ? ' active' : '') + '" style="--rec:' + corRec(r, k) + '" data-rec="' + k + '">' +
      '<span class="ic">' + svg(r.icone) + '</span>' +
      '<span><span class="num">' + rotBloco() + (numRec(r) ? ' ' + numRec(r) : '') + (r.arquivado ? ' · Arquivada' : '') + '</span>' +
      '<h3>' + r.titulo + '</h3><p>' + r.chamada + '</p></span>' +
    '</button>').join('') + '</div>';
}
const recAtual = recs => Math.min(Math.max(state.rec, 0), recs.length - 1);

function paginaRecomendacoes(conteudo){
  const recs = conteudo.recomendacoes;
  const i = recAtual(recs);
  const rec = recs[i];
  const st = STATUS[statusRecomendacao(rec, leEstado())];

  const corpo =
    '<div class="card rec-body" style="--rec:' + corRec(rec, i) + '">' +
      '<div class="rec-tags">' +
        '<span class="tag rec">' + svg('doc') + rotBloco() + (numRec(rec) ? ' ' + numRec(rec) : '') + '</span>' +
        '<span class="tag info">' + svg(st.icone) + st.rotulo + '</span>' +
      '</div>' +
      '<h2>' + rec.titulo + '</h2>' +
      (rec.fonte ? '<p class="fonte">' + rec.fonte + '</p>' : '<div style="height:18px"></div>') +
      '<div class="txt">' + rec.paragrafos.map(t => '<p>' + t + '</p>').join('') + '</div>' +
    '</div>';

  return '<h1 class="page-hello">' + rotTitulo() + '</h1>' +
    '<p class="page-date">' + conteudo.piloto.programa + ' · ' + recs.length + ' ' +
      (recs.length === 1 ? rotBloco().toLowerCase() : rotPlural()) + ' do relatório final</p>' +
    seletorPiloto() + seletorRecs(recs, i) + notaRecArquivada(rec) + corpo;
}

/* ---------------------------------------------------------------- Planos de Ação */
function paginaPlanos(conteudo){
  const recs = conteudo.recomendacoes;
  const i    = recAtual(recs);
  const rec  = recs[i];
  const cor  = corRec(rec, i);
  const est  = leEstado();
  const acoes = acoesDaRec(rec);

  const comPrazo = acoes.filter(a => est[a.codigo] && est[a.codigo].prazo).length;
  const atrasos  = acoes.filter(a => acaoAtrasada(a, est[a.codigo])).length;
  const nHist    = acoes.reduce((s, a) => s + historicoDe(est[a.codigo]).length, 0);
  const plural = (n, s, p) => n + ' ' + (n === 1 ? s : p);

  const barra =
    '<div class="pl-bar">' +
      '<div class="pl-resumo">' + plural(acoes.length, 'ação', 'ações') + ' · ' +
        '<b>' + comPrazo + '</b> com prazo definido' +
        (atrasos ? ' · <b class="tx-red">' + plural(atrasos, 'atrasada', 'atrasadas') + '</b>' : '') +
      '</div>' +
      '<div class="pl-views">' +
        '<button data-vis="lista"' + (state.vis === 'lista' ? ' class="active"' : '') + '>Lista</button>' +
        '<button data-vis="quadro"' + (state.vis === 'quadro' ? ' class="active"' : '') + '>Quadro</button>' +
        '<button data-vis="roadmap"' + (state.vis === 'roadmap' ? ' class="active"' : '') + '>Roadmap</button>' +
      '</div>' +
    '</div>' +
    '<div class="acao-acoes" style="border-top:0;padding-top:0;margin-top:-4px">' +
      '<button class="btn-acao neutra" data-histplano="1">' + svg('historico') +
        'Histórico de atualizações do plano' +
        (nHist ? '<span class="qt">' + nHist + '</span>' : '') + '</button>' +
    '</div>';

  const dicas = {
    quadro:  'As colunas seguem a situação registrada na ficha. Para mudar a situação de uma ação, ' +
             'use o botão Atualizar do cartão.',
    roadmap: 'A linha do tempo vai do primeiro ao último prazo definido. Ações sem prazo ficam listadas ao final.'
  };
  const dica = dicas[state.vis] ? '<p class="kb-dica">' + dicas[state.vis] + '</p>' : '';
  const corpo = dica + (
    state.vis === 'quadro'  ? quadroAcoes(acoes, est, cor) :
    state.vis === 'roadmap' ? roadmapAcoes(acoes, est, cor) :
                              listaAcoes(acoes, est, cor));

  return '<h1 class="page-hello">Plano de Ação</h1>' +
    '<p class="page-date">' + conteudo.piloto.programa + (rec.quadro ? ' · ' + rec.quadro : '') + '</p>' +
    seletorPiloto() + seletorRecs(recs, i) + notaRecArquivada(rec) + barra + corpo + blocoAcoesArquivadas(rec, est);
}

/* Acoes arquivadas pela coordenacao: ficam ao fim do plano, so para consulta. */
function blocoAcoesArquivadas(rec, est){
  const xs = acoesArquivadasDaRec(rec);
  if(!xs.length) return '';
  return '<section class="card acoes-arq">' +
    '<h3>' + svg('arquivar') + (xs.length === 1 ? 'Ação arquivada' : 'Ações arquivadas') + '</h3>' +
    '<p class="sub">' + (xs.length === 1
      ? 'Retirada do acompanhamento pela coordenação. Fica aqui só para consulta.'
      : 'Retiradas do acompanhamento pela coordenação. Ficam aqui só para consulta.') + '</p>' +
    '<ul>' + xs.map(a => {
      const m = marcaAcao(rec._org, rec._pil, a.codigo);
      return '<li>' + chipCod(codAcao(a.codigo, rec._org, rec._pil)) +
        '<span class="tit">' + ouDefinir(esc(valorCampo(a, est[a.codigo], 'titulo'))) + '</span>' +
        (m.arquivadoEm ? '<span class="quando">Arquivada em ' + diaDeIso(m.arquivadoEm) + '</span>' : '') +
        '<button class="btn-acao neutra" data-hist="' + a.codigo + '">' + svg('historico') + 'Histórico</button></li>';
    }).join('') + '</ul></section>';
}

/* Ação criada pelo órgão: os campos são os mesmos da ficha do relatório, e o
   código segue a numeração da recomendação. Como toda escrita do sistema, ela
   acontece em janela: a página em si é só leitura.                          */
function camposNovaAcao(rec){
  return '<label class="campo cresce"><span>Título da ação</span>' +
      '<input type="text" name="titulo" required maxlength="160" placeholder="O que será feito"></label>' +
    '<label class="campo cresce"><span>Descrição</span>' +
      '<textarea name="descricao" rows="3" placeholder="Detalhamento da ação, escopo e forma de execução."></textarea></label>' +
    '<div class="ev-form-linha">' +
      '<label class="campo cresce"><span>Responsável</span>' +
        '<input type="text" name="responsavel" placeholder="Unidade ou órgão"></label>' +
      '<label class="campo"><span>Prazo pactuado</span><input type="date" name="prazo"></label>' +
    '</div>' +
    '<div class="ev-form-linha">' +
      '<label class="campo cresce"><span>Área responsável</span>' +
        '<input type="text" name="area" placeholder="Departamento, coordenação ou divisão"></label>' +
      '<label class="campo cresce"><span>Pessoa responsável</span>' +
        '<input type="text" name="pessoa" placeholder="Nome de quem conduz a ação"></label>' +
      '<label class="campo check"><input type="checkbox" name="recorrente">' +
        '<span>Repetir todo ano até ' + ANO_LIMITE + ', criando uma ação por exercício</span></label>' +
    '</div>' +
    '<div class="ev-form-linha">' +
      '<label class="campo cresce"><span>Produto esperado</span>' +
        '<input type="text" name="produto" placeholder="Entregável que comprova a conclusão"></label>' +
      '<label class="campo cresce"><span>Resultado esperado</span>' +
        '<input type="text" name="resultado" placeholder="O que passa a acontecer com o produto em uso"></label>' +
    '</div>';
}

function janelaNovaAcao(){
  const rec  = recDaJanela();
  const sig  = state.alvo ? ((orgaoPorId(state.alvo.org) || {}).sigla || '') + ' · ' : '';
  return '<div class="mo-caixa" role="dialog" aria-modal="true" aria-label="Adicionar ação">' +
    '<header class="mo-topo">' +
      '<div class="tit">' + chipCod((numRec(rec) || '') + '.' + (acoesDaRec(rec).length + 1)) +
        '<span class="mo-eyebrow">' + esc(sig) + 'Adicionar ação à ' + rotBloco() + (numRec(rec) ? ' ' + numRec(rec) : '') + '</span>' +
        '<b>' + (state.alvo ? 'Nova ação, cadastrada pela coordenação' : 'Nova ação do órgão') + '</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    '<form class="mo-corpo" id="form-nova" data-formacao="' + rec.numero + '" novalidate>' +
      '<section class="mo-grupo">' + camposNovaAcao(rec) + '</section>' +
    '</form>' +
    '<footer class="mo-rodape">' +
      '<button class="btn-neutro" data-fechar="1">Cancelar</button>' +
      '<button class="btn-primario" data-criar="1">' + svg('mais') + 'Adicionar ação</button>' +
    '</footer>' +
  '</div>';
}

/* Barra de progresso da acao, na visao em lista e no cartao do quadro. */
function barraProgresso(a, e, compacta){
  const p = progressoAcao(a, e);
  return '<div class="' + (compacta ? 'kb-pg' : 'pg') + '">' +
    (compacta ? '' : '<span class="pg-rot">Progresso</span>') +
    '<span class="pg-barra"><i style="width:' + p + '%"></i></span>' +
    '<span class="pg-num">' + p + '%</span>' +
  '</div>';
}

/* Editar e Consultar histórico ficam no rodapé de cada ação. Toda a ficha é
   editável pela janela; o prazo, a situação e a justificativa continuam
   também no próprio cartão, por serem o que mais muda no dia a dia.        */
function rodapeAcao(a, e){
  const n = historicoDe(e).length;
  return '<div class="acao-acoes">' +
    (soLeitura() ? '' :
      '<button class="btn-acao" data-editar="' + a.codigo + '">' + svg('lapis') + 'Atualizar</button>') +
    '<button class="btn-acao neutra" data-hist="' + a.codigo + '">' + svg('historico') +
      'Consultar histórico' + (n ? '<span class="qt">' + n + '</span>' : '') + '</button>' +
  '</div>';
}

/* O cartao em leitura usa as mesmas divisoes da janela de edicao, na mesma
   ordem e com os mesmos nomes, para que o exposto e o editavel se leiam da
   mesma forma: Responsabilidade, Escopo e entrega, Acompanhamento (com a
   situacao, o prazo, o progresso e a justificativa juntos) e Evidencias.  */
function secaoAcao(titulo, corpo, selo){
  return '<section class="acao-sec"><h4>' + titulo +
    (selo ? '<span class="qt">' + selo + '</span>' : '') + '</h4>' + corpo + '</section>';
}
/* Acao criada no sistema, e nao no relatorio: diz quem a criou. */
const seloNova = a => a.nova
  ? '<span class="badge b-nova">' + svg('mais') +
    (a.origem === 'coordenacao' ? 'Adicionada pela coordenação' : 'Adicionada pelo órgão') + '</span>'
  : '';
const fichaCampos = (pares, colunas) =>
  '<dl class="acao-campos' + (colunas === 2 ? ' duas' : '') + '">' + pares.map(c =>
    '<div><dt>' + c[0] + '</dt><dd>' + ouDefinir(c[1]) + '</dd></div>').join('') + '</dl>';

function listaAcoes(acoes, est, cor){
  return acoes.map(a => {
    const e  = est[a.codigo];
    const st = STATUS_ACAO[acaoStatus(a, e)];
    const atrasada = acaoAtrasada(a, e);
    const v = campo => valorCampo(a, e, campo);
    const evs = evidenciasDe(e);
    const semEvid = acaoStatus(a, e) === 'concluida' && !evs.length;

    return '<article class="acao" style="--rec:' + cor + '">' +
      '<div class="acao-top">' +
        chipCod(codAcao(a.codigo)) +
        selosCiclo(a) +
        seloNova(a) +
        '<span class="badge b-' + acaoStatus(a, e) + '">' + svg(st.icone) + st.rotulo + '</span>' +
        (atrasada ? '<span class="badge b-atraso">' + svg('alerta') + 'Atrasada</span>' : '') +
        (semEvid ? '<span class="badge b-atraso">' + svg('alerta') + 'Sem evidência</span>' : '') +
      '</div>' +
      '<h3>' + ouDefinir(v('titulo')) + '</h3>' +
      '<p class="desc">' + ouDefinir(v('descricao')) + '</p>' +

      secaoAcao('Responsabilidade', fichaCampos([
        ['Responsável (unidade ou órgão)', v('responsavel')],
        ['Área responsável', v('area')],
        ['Pessoa responsável', v('pessoa')]
      ])) +

      secaoAcao('Escopo e entrega', fichaCampos([
        ['Produto esperado', v('produto')],
        ['Resultado esperado', v('resultado')]
      ], 2)) +

      secaoAcao('Acompanhamento',
        fichaCampos([
          ['Situação', st.rotulo],
          ['Prazo pactuado', dataBR((e && e.prazo) || '')]
        ], 2) +
        barraProgresso(a, e) +
        caixaJustificativa(a, e)) +

      secaoAcao('Evidências', listaEvidencias(evs), evs.length) +
      rodapeAcao(a, e) +
    '</article>';
  }).join('');
}

function quadroAcoes(acoes, est, cor){
  return '<div class="kb">' + Object.keys(STATUS_ACAO).map(k => {
    const doGrupo = acoes.filter(a => acaoStatus(a, est[a.codigo]) === k);
    const cards = doGrupo.map(a => {
      const e = est[a.codigo];
      const resp = [valorCampo(a, e, 'pessoa'), valorCampo(a, e, 'area') ||
                    valorCampo(a, e, 'responsavel')].filter(Boolean).join(' · ');
      const nEv = evidenciasDe(e).length;
      return '<article class="kb-card" data-acao="' + a.codigo + '" style="--rec:' + cor + '">' +
        '<div class="kb-cod">' + codAcao(a.codigo) + (a.ciclo ? '<em>ciclo ' + a.ciclo + '</em>' : '') + '</div>' +
        '<h4>' + ouDefinir(valorCampo(a, e, 'titulo')) + '</h4>' +
        '<div class="kb-resp">' + ouDefinir(resp) + '</div>' +
        '<div class="kb-prazo' + (acaoAtrasada(a, e) ? ' late' : '') + '">' + svg('agenda') +
          ouDefinir((e && e.prazo) ? dataBR(e.prazo) : '') + '</div>' +
        barraProgresso(a, e, true) +
        caixaJustificativa(a, e, true) +
        '<div class="kb-evid">' + svg('clipe') + nEv +
          (nEv === 1 ? ' evidência' : ' evidências') + '</div>' +
        (soLeitura() ? '' : '<button class="kb-editar" data-editar="' + a.codigo + '">' +
          svg('lapis') + 'Atualizar</button>') +
      '</article>';
    }).join('') || '<div class="kb-vazio">Nenhuma ação</div>';

    return '<section class="kb-col" data-col="' + k + '"><header>' + svg(STATUS_ACAO[k].icone) +
      STATUS_ACAO[k].rotulo + '<span class="qt">' + doGrupo.length + '</span></header>' + cards + '</section>';
  }).join('') + '</div>';
}

/* Roadmap: cada acao vira um marco posicionado no seu prazo pactuado, agrupado
   pelo horizonte estimado no relatorio. A escala vai do primeiro ao ultimo prazo,
   sempre incluindo a data de hoje, para que o atraso fique visivel. */
function roadmapAcoes(acoes, est, cor){
  const comPrazo = acoes.filter(a => (est[a.codigo] || {}).prazo);
  const semPrazo = acoes.filter(a => !(est[a.codigo] || {}).prazo);

  const listaSem = semPrazo.length
    ? '<div class="rm-sem"><b>' + semPrazo.length +
        (semPrazo.length === 1 ? ' ação sem prazo definido' : ' ações sem prazo definido') +
        ', fora da linha do tempo:</b><ul>' +
        semPrazo.map(a => '<li>' + (codAcao(a.codigo) ? codAcao(a.codigo) + ' · ' : '') + a.titulo +
          (a.ciclo ? ' (ciclo ' + a.ciclo + ')' : '') + '</li>').join('') + '</ul></div>'
    : '';

  if(!comPrazo.length)
    return '<div class="card rm-wrap"><div class="rm-vazio">' +
      'Defina o prazo de ao menos uma ação para montar a linha do tempo.</div>' + listaSem + '</div>';

  const DIA   = 86400000;
  const hoje  = hojeZero();
  const datas = comPrazo.map(a => new Date(est[a.codigo].prazo + 'T00:00:00')).concat([hoje]);
  const menor = new Date(Math.min.apply(null, datas));
  const maior = new Date(Math.max.apply(null, datas));
  const ini   = new Date(menor.getFullYear(), menor.getMonth(), 1);
  const fim   = new Date(maior.getFullYear(), maior.getMonth() + 1, 0);
  const vao   = Math.max(fim - ini, DIA);
  const pct   = d => ((d - ini) / vao) * 100;
  const trava = p => Math.max(0, Math.min(100, p));

  /* Cada rotulo de mes precisa de espaco proprio no eixo. Ate certo ponto
     basta mostrar um mes sim, outros nao; passado esse ponto o eixo fica
     mais largo que a tela e a faixa passa a rolar na horizontal, em vez de
     amontoar os meses uns sobre os outros.                                */
  const ESPACO_MES = 58, LARGURA_LBL = 300, LARGURA_MIN = 780;
  const meses = [];
  for(let m = new Date(ini); m <= fim; m.setMonth(m.getMonth() + 1)) meses.push(new Date(m));
  let passo = meses.length > 16 ? 3 : (meses.length > 9 ? 2 : 1);
  while(Math.ceil(meses.length / passo) > 30) passo++;
  const nRotulos = Math.ceil(meses.length / passo);
  const largura  = Math.max(LARGURA_MIN, LARGURA_LBL + nRotulos * ESPACO_MES);
  const rola     = largura > LARGURA_MIN;

  const eixo = meses.filter((m, k) => k % passo === 0).map(m => {
    const meio = new Date(m.getFullYear(), m.getMonth(), 15);
    const rot = m.toLocaleDateString('pt-BR', { month:'short' }).replace('.', '') +
                '/' + String(m.getFullYear()).slice(2);
    return '<span class="rm-mes" style="left:' + trava(pct(meio)).toFixed(2) + '%">' + rot + '</span>';
  }).join('');

  const linhas = comPrazo
    .slice()
    .sort((x, y) => est[x.codigo].prazo.localeCompare(est[y.codigo].prazo))
    .map(a => {
      const e = est[a.codigo];
      const d = new Date(e.prazo + 'T00:00:00');
      const atrasada = acaoAtrasada(a, e);
      const st = atrasada ? 'atrasada' : acaoStatus(a, e);
      const p  = trava(pct(d));
      const lado = p < 7 ? ' esq' : (p > 93 ? ' dir' : '');
      const faixa = atrasada
        ? '<span class="rm-atraso" style="left:' + p.toFixed(2) + '%;width:' +
          Math.max(0, trava(pct(hoje)) - p).toFixed(2) + '%"></span>'
        : '';
      return '<div class="rm-linha">' +
        '<div class="rm-lbl">' + chipCod(codAcao(a.codigo)) +
          '<span><span class="tit">' + valorCampo(a, est[a.codigo], 'titulo') + '</span>' +
          '<span class="resp">' + (valorCampo(a, est[a.codigo], 'pessoa') ||
            valorCampo(a, est[a.codigo], 'responsavel')) +
            (a.ciclo ? ' · ciclo ' + a.ciclo : '') + '</span></span></div>' +
        '<div class="rm-track">' + faixa +
          '<span class="rm-marco m-' + st + lado + '" style="left:' + p.toFixed(2) + '%">' +
            d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit' }) +
            (atrasada ? '<em>' + Math.round((hoje - d) / DIA) + 'd</em>' : '') +
          '</span>' +
        '</div></div>';
    }).join('');

  const fh = (trava(pct(hoje)) / 100).toFixed(4);
  const linhaHoje = '<span class="rm-hoje" style="left:calc(var(--lbl) + (100% - var(--lbl)) * ' +
                    fh + ')"><em>hoje</em></span>';

  /* A lista de ações sem prazo fica fora da área que rola, para não sumir
     para o lado junto com a linha do tempo.                              */
  return '<div class="card rm-wrap" style="--rec:' + cor + '">' +
      (rola ? '<p class="rm-dica">' + svg('info') +
        'O período é longo para caber na tela. Arraste a linha do tempo para o lado, ' +
        'ou use a barra abaixo dela.</p>' : '') +
      '<div class="rm-rolagem' + (rola ? ' rola' : '') + '">' +
        '<div class="rm" style="min-width:' + largura + 'px">' +
          '<div class="rm-head"><div></div><div class="rm-eixo">' + eixo + '</div></div>' +
          '<div class="rm-corpo">' + linhaHoje + '<div class="rm-lista">' + linhas + '</div></div>' +
        '</div>' +
      '</div>' +
      listaSem +
    '</div>';
}

/* ================================================================
   JANELA DE EDICAO DA ACAO E HISTORICO DE ATUALIZACOES
   A janela e a unica superficie que edita a ficha inteira. Ela vive
   fora de #page para que a pagina possa ser redesenhada sem derrubar
   o que esta sendo digitado. Cada gravacao guarda a janela como foi
   salva, com data e hora, no historico da propria acao.
   ================================================================ */
function abreModal(tipo, codigo){ state.modal = { tipo:tipo, codigo:codigo || null }; state.histSel = null; desenhaModal(); }
/* Fechar a janela encerra tambem o estudo alvo da coordenacao. */
/* Na janela aberta pela coordenacao, o topo diz de que secretaria e a acao. */
const prefixoAlvo = () => state.alvo ? esc((orgaoPorId(state.alvo.org) || {}).sigla || '') + ' · ' : '';
function fechaModal(){ state.modal = null; state.alvo = null; desenhaModal(); }
const redesenha = () =>
  desenhaPagina(menuAtual().filter(m => m.id === state.pagina)[0] || menuAtual()[0]);

/* Tipos de janela que pertencem as Configuracoes da coordenacao. O codigo
   delas nao e um codigo de acao, por isso saem antes da busca da acao.   */
const JANELAS_CFG = { cfgOrg:janelaCfgOrg, cfgPil:janelaCfgPil, cfgRec:janelaCfgRec, cfgApagar:janelaCfgApagar, cfgExcluir:janelaCfgExcluir,
                      cfgUsu:janelaCfgUsu, cfgUsuExcluir:janelaCfgUsuExcluir };

function desenhaModal(){
  cacheNum = {};
  const box = $('#modal');
  const m   = state.modal;
  if(!m){
    box.hidden = true; box.innerHTML = '';
    document.body.classList.remove('modal-aberto');
    return;
  }
  if(JANELAS_CFG[m.tipo]){
    const html = JANELAS_CFG[m.tipo](m.codigo);
    if(!html){ fechaModal(); return; }
    box.innerHTML = html;
    box.hidden = false;
    document.body.classList.add('modal-aberto');
    ligaModalCfg(m);
    return;
  }
  /* Janelas de consulta da coordenacao: a chave traz o estudo, e nao so o
     codigo da acao, porque 1.1 existe em todos os estudos.               */
  if(JANELAS_SEFA[m.tipo]){
    const html = JANELAS_SEFA[m.tipo](m.codigo);
    if(!html){ fechaModal(); return; }
    box.innerHTML = html;
    box.hidden = false;
    document.body.classList.add('modal-aberto');
    box.querySelectorAll('[data-fechar]').forEach(b =>
      b.addEventListener('click', () => { fechaModal(); redesenha(); }));
    ligaHistSel(box);
    ligaRemocaoEvidencia(box, async () => {
      try{ await atualizaConsolidado(); }catch(e){ mostraErro(e); }
      desenhaModal();
    });
    return;
  }
  const a = m.codigo ? acaoPorCodigo(m.codigo) : null;
  /* Estudo arquivado: a ficha so abre em consulta, pelo historico. */
  if((m.codigo && !a) || (soLeitura() && (m.tipo === 'edicao' || m.tipo === 'nova'))){
    state.modal = null;
    box.hidden = true; box.innerHTML = '';
    document.body.classList.remove('modal-aberto');
    return;
  }
  const e = a ? leEstado()[a.codigo] : null;
  box.innerHTML = m.tipo === 'edicao'     ? janelaEdicao(a, e)
                : m.tipo === 'historico'  ? janelaHistorico(a, e)
                : m.tipo === 'nova'       ? janelaNovaAcao()
                                          : janelaConsolidado();
  box.hidden = false;
  document.body.classList.add('modal-aberto');
  ligaModal(a);
}

/* Um campo da ficha, no formato que a janela usa. */
function campoEdicao(a, e, c){
  const v    = valorCampo(a, e, c.id);
  const nome = 'f_' + c.id;
  const dica = c.dica ? ' placeholder="' + esc(c.dica) + '"' : '';
  const rot  = '<span>' + c.rotulo + '</span>';

  if(c.tipo === 'area')
    return '<label class="campo cresce">' + rot + '<textarea name="' + nome + '" rows="' +
      (c.linhas || 3) + '"' + dica + '>' + esc(v) + '</textarea></label>';

  if(c.tipo === 'status'){
    return '<label class="campo">' + rot + '<select name="' + nome + '">' +
      Object.keys(STATUS_ACAO).map(k => '<option value="' + k + '"' +
        (k === String(v) ? ' selected' : '') + '>' + STATUS_ACAO[k].rotulo + '</option>').join('') +
      '</select></label>';
  }

  if(c.tipo === 'data')
    return '<label class="campo">' + rot +
      '<input type="date" name="' + nome + '" value="' + esc(v) + '"></label>';

  if(c.tipo === 'percentual')
    return '<label class="campo">' + rot +
      '<span class="pct-campo"><input type="number" name="' + nome + '" min="0" max="100" step="1" ' +
        'inputmode="numeric" value="' + v + '"><em>%</em></span>' +
      '<span class="pct-barra"><i style="width:' + v + '%"></i></span></label>';

  return '<label class="campo cresce">' + rot +
    '<input type="text" name="' + nome + '" value="' + esc(v) + '"' + dica + '></label>';
}

/* As evidencias passam a ser anexadas pela propria janela da acao. O
   registro so e gravado quando a edicao e salva, junto com o resto.      */
function blocoEvidencias(a, e){
  const evs = evidenciasDe(e);
  const itens = evs.length
    ? '<ul class="ev-lista">' + evs.map(ev =>
        '<li class="ev-item"><span class="ic">' + svg('clipe') + '</span>' +
          '<div class="ev-corpo"><div class="ev-data">' + ouDefinir(dataBR(ev.data)) + '</div>' +
            '<p class="ev-texto">' + ouDefinir(esc(ev.texto)) + '</p>' +
            (ev.anexos && ev.anexos.length
              ? '<div class="ev-anexos">' + ev.anexos.map(chipAnexo).join('') + '</div>'
              : '') +
          '</div>' +
          btnRemoverEv(ev.id) +
        '</li>').join('') + '</ul>'
    : '<p class="ev-vazio">Nenhuma evidência registrada nesta ação.</p>';

  return '<section class="mo-grupo"><h4>Evidências</h4>' + itens +
    '<div class="mo-linha" style="margin-top:14px">' +
      '<label class="campo"><span>Data do registro</span>' +
        '<input type="date" name="f_evdata" value="' + isoHoje() + '"></label>' +
      '<div class="campo cresce"><span>Anexos</span>' +
        '<ul class="ev-pend" id="ev-pend">' + listaPendentes() + '</ul>' +
        '<input type="file" id="f-evanexos" multiple hidden>' +
        '<button type="button" class="ev-add ev-escolher" data-escolher="1">' + svg('mais') +
          'Escolher arquivos</button></div>' +
    '</div>' +
    '<label class="campo cresce" style="margin-top:14px"><span>Nova evidência</span>' +
      '<textarea name="f_evtexto" rows="2" placeholder="O que foi executado e como isso comprova o ' +
        'produto esperado. O registro é gravado ao salvar a atualização."></textarea></label>' +
    '<p class="mo-origem">Anexe quantos arquivos quiser: cada escolha entra na lista e o X retira o arquivo. ' +
      'Eles são enviados ao salvar a atualização, junto com a evidência (até 25 MB por arquivo). ' +
      'Clique no nome de um anexo registrado para baixá-lo.</p>' +
  '</section>';
}

/* Arquivos escolhidos para a nova evidencia, ainda nao enviados. Ficam na
   janela aberta (state.modal.anexos), para nao se perderem quando ela se
   redesenha: cada escolha acrescenta a lista, o X retira, e tudo sobe ao
   servidor so ao salvar a atualizacao.                                  */
const anexosPendentes = () => (state.modal && state.modal.anexos) || [];
function listaPendentes(){
  const xs = anexosPendentes();
  if(!xs.length) return '<li class="ev-pend-vazio">Nenhum arquivo escolhido.</li>';
  return xs.map((f, i) => '<li class="ev-pend-item">' + svg('arquivo') +
    '<span class="nome">' + esc(f.name) + '</span><em>' + tamanhoArq(f.size) + '</em>' +
    '<button type="button" class="ev-pend-tirar" data-tirarpend="' + i + '" title="Retirar ' + esc(f.name) +
      '" aria-label="Retirar ' + esc(f.name) + '">' + svg('fechar') + '</button></li>').join('');
}
function ligaPendentes(form){
  const entrada = form.querySelector('#f-evanexos');
  if(!entrada) return;
  const lista = form.querySelector('#ev-pend');
  const atualiza = () => {
    lista.innerHTML = listaPendentes();
    lista.querySelectorAll('[data-tirarpend]').forEach(b => b.addEventListener('click', () => {
      state.modal.anexos.splice(parseInt(b.dataset.tirarpend, 10), 1);
      atualiza();
    }));
  };
  form.querySelector('[data-escolher]').addEventListener('click', () => entrada.click());
  entrada.addEventListener('change', () => {
    const xs = state.modal.anexos = state.modal.anexos || [];
    const grandes = [];
    Array.from(entrada.files || []).forEach(f => {
      if(f.size > srv.LIMITE_ANEXO){ grandes.push(f.name); return; }
      /* O mesmo arquivo escolhido de novo nao entra duas vezes. */
      if(!xs.some(x => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified)) xs.push(f);
    });
    entrada.value = '';
    atualiza();
    if(grandes.length) mostraErro(new Error(grandes.length === 1
      ? 'O arquivo "' + grandes[0] + '" passa do limite de 25 MB e não foi incluído.'
      : 'Os arquivos "' + grandes.join('", "') + '" passam do limite de 25 MB e não foram incluídos.'));
  });
  atualiza();
}

function janelaEdicao(a, e){
  /* Cada grupo recebe as suas linhas: campos curtos dividem a linha, campos
     de texto longo ficam sozinhos para caber inteiros na tela.            */
  const grupo = (titulo, linhas) =>
    '<section class="mo-grupo"><h4>' + titulo + '</h4>' +
      linhas.map(ids => '<div class="mo-linha">' +
        ids.map(id => campoEdicao(a, e, campoPorId(id))).join('') + '</div>').join('') +
    '</section>';

  const topo = rotulo => '<header class="mo-topo">' +
      '<div class="tit">' + chipCod(codAcao(a.codigo)) +
        '<span class="mo-eyebrow">' + prefixoAlvo() + rotulo + '</span>' +
        '<b>' + valorCampo(a, e, 'titulo') + '</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>';

  /* Coordenacao: edicao estrutural. A ficha e o prazo pactuado mudam e o
     que mudou entra no historico; o acompanhamento e da secretaria.        */
  if(state.alvo)
    return '<div class="mo-caixa" role="dialog" aria-modal="true" aria-label="Edição estrutural da ação">' +
      topo('Edição estrutural da ação') +
      '<form class="mo-corpo" id="form-edicao" novalidate>' +
        grupo('Identificação', [['titulo'], ['descricao']]) +
        grupo('Responsabilidade', [['responsavel', 'area', 'pessoa']]) +
        grupo('Escopo e entrega', [['produto'], ['resultado']]) +
        grupo('Prazo', [['prazo']]) +
        '<section class="mo-grupo"><p class="mo-aviso">' + svg('info') + '<span>Edição estrutural: o que for ' +
          'alterado fica registrado no histórico da ação, com a data, a hora e o e-mail do login. Situação, ' +
          'progresso, justificativa e evidências são atualizados pela secretaria.</span></p></section>' +
      '</form>' +
      '<footer class="mo-rodape">' +
        '<button class="btn-neutro" data-fechar="1">Cancelar</button>' +
        '<button class="btn-primario" data-salvar="1">' + svg('ok') + 'Salvar</button>' +
      '</footer>' +
    '</div>';

  /* Secretaria: atualiza so o acompanhamento (situacao, progresso e
     justificativa) e registra evidencias. O prazo pactuado aparece para
     consulta: quem o define e a coordenacao.                             */
  const prazo = (e && e.prazo) ? dataBR(e.prazo) : '';
  return '<div class="mo-caixa" role="dialog" aria-modal="true" aria-label="Atualizar ação">' +
    topo('Atualizar o acompanhamento da ação') +
    '<form class="mo-corpo" id="form-edicao" novalidate>' +
      '<section class="mo-grupo"><h4>Acompanhamento</h4>' +
        '<div class="mo-linha">' +
          campoEdicao(a, e, campoPorId('status')) +
          '<div class="campo"><span>Prazo pactuado</span><p class="mo-fixo">' + ouDefinir(prazo) + '</p></div>' +
          campoEdicao(a, e, campoPorId('progresso')) +
        '</div>' +
        '<div class="mo-linha">' + campoEdicao(a, e, campoPorId('justificativa')) + '</div>' +
      '</section>' +
      blocoEvidencias(a, e) +
      '<section class="mo-grupo"><h4>Registro da atualização</h4>' +
        '<div class="mo-linha">' +
          '<label class="campo cresce"><span>Nome <em class="obrig">(obrigatório)</em></span>' +
            '<input type="text" name="f_autor" required autocomplete="name" ' +
              'placeholder="Seu nome completo"></label>' +
          '<div class="campo"><span>E-mail do login</span><p class="mo-fixo">' +
            ouDefinir(esc((state.usuario && state.usuario.email) || '')) + '</p></div>' +
          '<div class="campo"><span>Data</span><p class="mo-fixo">' + dataBR(isoHoje()) + '</p></div>' +
        '</div>' +
        '<p class="mo-erro" id="erro-autor" hidden>Informe o nome de quem está registrando a atualização.</p>' +
        '<p class="mo-aviso">' + svg('info') + 'Ao salvar, a data, a hora e o e-mail do login entram ' +
          'automaticamente e a atualização fica guardada no histórico da ação, com o que foi alterado.</p>' +
      '</section>' +
    '</form>' +
    '<footer class="mo-rodape">' +
      '<button class="btn-neutro" data-fechar="1">Cancelar</button>' +
      '<button class="btn-primario" data-salvar="1">' + svg('ok') + 'Salvar atualização</button>' +
    '</footer>' +
  '</div>';
}

/* Um registro do historico: quando, por quem, o que mudou e a janela
   inteira como foi salva naquele momento.                              */
const TIPOS_HIST = {
  edicao:      { rotulo:'Atualização',                selo:'b-edicao' },
  rapida:      { rotulo:'Alteração direta no cartão', selo:'b-rapida' },
  coordenacao: { rotulo:'Edição pela coordenação',    selo:'b-ciclo'  },
  remocao:     { rotulo:'Remoção de evidência',       selo:'b-atraso' }
};

/* Remocao de evidencia: o motivo e o que saiu (texto, data e anexos). */
function corpoRemocao(h){
  const c = h.campos || {}, ev = c.evidencia || {}, anexos = ev.anexos || [];
  return '<dl class="hi-rem">' +
    '<div><dt>Motivo</dt><dd>' + ouDefinir(esc(c.motivo)) + '</dd></div>' +
    '<div><dt>Evidência removida</dt><dd>' + (ev.data ? dataBR(ev.data) + ' · ' : '') +
      ouDefinir(esc(ev.texto)) + '</dd></div>' +
    (anexos.length
      ? '<div><dt>' + (anexos.length === 1 ? 'Anexo removido' : 'Anexos removidos') + '</dt><dd>' +
          anexos.map(x => esc(x.nome)).join(', ') + '</dd></div>'
      : '') +
  '</dl>';
}

/* Evidencia anexada numa atualizacao: a data, o texto e os anexos, que o
   restrito e o gestor baixam dali mesmo (o clique no anexo e o mesmo do
   cartao da acao). Se ela foi removida depois, os arquivos ja sairam do
   sistema: ficam o texto, o nome dos anexos e quando, por quem e por que
   saiu. Sem a coluna evidencia_id no servidor (migration ainda nao
   aplicada), mostra so o texto, como antes.                              */
function evidenciaNoHistorico(h, m){
  if(h.evidenciaId === undefined)
    return '<li><b>' + m.rotulo + '</b><span class="para">' + mostraValor(m.campo, m.para) + '</span></li>';
  const ev  = h.evidenciaId ? DB.evPorId[h.evidenciaId] : null;
  const rem = !ev && h.evidenciaId ? DB.remocoes[h.evidenciaId] : null;
  const saiu = rem ? ((rem.campos || {}).evidencia || {}) : {};
  const data   = ev ? ev.data : saiu.data;
  const anexos = ev ? ev.anexos : (saiu.anexos || []);
  const nota = ev ? (anexos.length ? '' : '<p class="hi-ev-nota">Sem arquivo anexado.</p>')
    : '<p class="hi-ev-nota">' + svg('alerta') + '<span>' + (rem
        ? 'Removida em ' + dataHoraBR(rem.em) + ' por ' + ouDefinir(esc(rem.autor)) +
          '. Motivo: ' + ouDefinir(esc((rem.campos || {}).motivo)) + '.'
        : 'Esta evidência foi removida depois.') +
      (anexos.length ? ' Os anexos saíram do sistema junto com ela.' : '') + '</span></p>';
  return '<li class="hi-ev"><b>' + m.rotulo + '</b>' +
    '<div class="hi-ev-corpo' + (ev ? '' : ' is-removida') + '">' +
      (data ? '<div class="ev-data">' + dataBR(data) + '</div>' : '') +
      '<p class="ev-texto">' + ouDefinir(esc(ev ? ev.texto : m.para)) + '</p>' +
      (anexos.length ? '<div class="ev-anexos">' + anexos.map(chipAnexo).join('') + '</div>' : '') +
      nota +
    '</div></li>';
}

function cartaoHistorico(h, n, codigo){
  const remocao = h.tipo === 'remocao';
  const mud = remocao ? corpoRemocao(h)
    : (h.mudancas || []).length
    ? '<ul class="hi-mud">' + h.mudancas.map(m => m.campo === 'evidencia' ? evidenciaNoHistorico(h, m) :
        '<li><b>' + m.rotulo + '</b>' +
          '<span class="de">' + mostraValor(m.campo, m.de) + '</span>' + svg('seta') +
          '<span class="para">' + mostraValor(m.campo, m.para) + '</span></li>').join('') + '</ul>'
    : '<p class="hi-sem">Janela salva sem alteração de campo.</p>';

  const janela = h.campos && !remocao
    ? '<details class="hi-snap"><summary>Ver a janela como foi salva</summary><dl>' +
        CAMPOS_ACAO.map(c => '<div><dt>' + c.rotulo + '</dt><dd>' +
          mostraValor(c.id, h.campos[c.id]) + '</dd></div>').join('') +
      '</dl></details>'
    : '';

  const tipo = TIPOS_HIST[h.tipo] || TIPOS_HIST.edicao;
  return '<article class="hi-item">' +
    '<div class="hi-topo">' +
      (n ? '<span class="hi-n">#' + n + '</span>' : '') +
      (codigo ? '<span class="hi-acao">' + codigo + '</span>' : '') +
      '<span class="hi-quando">' + dataHoraBR(h.em) + '</span>' +
      '<span class="badge ' + tipo.selo + '">' + tipo.rotulo + '</span>' +
      '<span class="hi-autor">por ' + ouDefinir(esc(h.autor)) + (h.email ? ' · ' + esc(h.email) : '') + '</span>' +
    '</div>' + mud + janela +
  '</article>';
}

function janelaHistorico(a, e){
  const hs = historicoDe(e);
  const corpo = hs.length
    ? hs.slice().reverse().map((h, k) => cartaoHistorico(h, hs.length - k)).join('')
    : '<p class="ev-vazio">Nenhuma atualização registrada nesta ação até agora.</p>';

  return '<div class="mo-caixa" role="dialog" aria-modal="true" aria-label="Histórico da ação">' +
    '<header class="mo-topo">' +
      '<div class="tit">' + chipCod(codAcao(a.codigo)) +
        '<span class="mo-eyebrow">' + prefixoAlvo() + 'Histórico de atualizações · ' +
          hs.length + (hs.length === 1 ? ' registro' : ' registros') + '</span>' +
        '<b>' + valorCampo(a, e, 'titulo') + '</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    '<div class="mo-corpo"><section class="mo-grupo">' + corpo + '</section></div>' +
    '<footer class="mo-rodape">' +
      (soLeitura() ? '' :
        '<button class="btn-neutro" data-editar-daqui="' + a.codigo + '">' + svg('lapis') + ' Atualizar a ação</button>') +
      '<button class="btn-primario" data-fechar="1">Fechar</button>' +
    '</footer>' +
  '</div>';
}

/* Historico com escolha da acao. A lista a esquerda traz cada acao com a
   quantidade de atualizacoes; o lado direito mostra so a escolhida, da
   mais recente para a mais antiga. "Todas as acoes" junta tudo, para quem
   quiser a sequencia completa. Ao abrir, vem selecionada a acao com a
   atualizacao mais recente. itens: [{ codigo, rotulo, titulo, hist }],
   em que codigo e a chave e rotulo o numero exibido.          */
function corpoHistorico(itens){
  const total = itens.reduce((n, it) => n + it.hist.length, 0);
  if(!itens.length)
    return '<div class="mo-corpo"><p class="ev-vazio">Nenhuma ação cadastrada.</p></div>';
  const ultima = it => it.hist.length ? it.hist[it.hist.length - 1].em : '';
  const recente = itens.slice().sort((x, y) => ultima(y).localeCompare(ultima(x)))[0];
  let sel = state.histSel;
  if(sel !== '*' && !itens.some(it => it.codigo === sel)) sel = recente.hist.length ? recente.codigo : itens[0].codigo;

  const opcao = (valor, cod, titulo, n) =>
    '<button type="button" class="hs-opt' + (valor === sel ? ' active' : '') + (n ? '' : ' vazia') +
      (valor === '*' ? ' todas' : (cod ? '' : ' semcod')) +
      '" data-histsel="' + esc(valor) + '">' +
      (cod ? '<span class="cod">' + esc(cod) + '</span>' : '') +
      '<span class="t">' + esc(titulo) + '</span>' +
      '<span class="qt">' + n + '</span>' +
    '</button>';
  const lista = '<nav class="hs-lista" aria-label="Escolha a ação">' +
    opcao('*', '', 'Todas as ações', total) +
    itens.map(it => opcao(it.codigo, it.rotulo || '', it.titulo, it.hist.length)).join('') + '</nav>';

  let regs;
  if(sel === '*'){
    const tudo = [];
    itens.forEach(it => it.hist.forEach(h => tudo.push({ h:h, codigo:it.rotulo || '' })));
    tudo.sort((x, y) => (x.h.em < y.h.em ? 1 : -1));
    regs = '<h4 class="hs-tit">Todas as ações · ' + contaTexto(tudo.length, 'atualização', 'atualizações') + '</h4>' +
      (tudo.length ? tudo.map(t => cartaoHistorico(t.h, 0, t.codigo)).join('')
                   : '<p class="ev-vazio">Nenhuma atualização registrada até agora.</p>');
  } else {
    const it = itens.filter(x => x.codigo === sel)[0];
    const hs = it.hist;
    regs = '<h4 class="hs-tit">' + chipCod(esc(it.rotulo || '')) + esc(it.titulo) + '</h4>' +
      (hs.length ? hs.slice().reverse().map((h, n) => cartaoHistorico(h, hs.length - n)).join('')
                 : '<p class="ev-vazio">Nenhuma atualização registrada nesta ação até agora.</p>');
  }
  return '<div class="mo-corpo hs">' + lista + '<section class="hs-reg">' + regs + '</section></div>';
}
/* Troca a acao escolhida no historico sem fechar a janela. */
function ligaHistSel(box){
  box.querySelectorAll('[data-histsel]').forEach(b =>
    b.addEventListener('click', () => { state.histSel = b.dataset.histsel; desenhaModal(); }));
}

/* Historico do plano: as acoes da recomendacao aberta. */
function janelaConsolidado(){
  const recs = (conteudoDe(state.perfil.id) || {}).recomendacoes || [];
  const rec  = recs[recAtual(recs)];
  const est  = leEstado();
  const itens = acoesDaRec(rec).map(a =>
    ({ codigo:a.codigo, rotulo:codAcao(a.codigo), titulo:valorCampo(a, est[a.codigo], 'titulo'), hist:historicoDe(est[a.codigo]) }));
  const total = itens.reduce((n, it) => n + it.hist.length, 0);

  return '<div class="mo-caixa mo-larga" role="dialog" aria-modal="true" aria-label="Histórico do plano">' +
    '<header class="mo-topo">' +
      '<div class="tit"><span class="mo-eyebrow">Histórico de atualizações · ' + rotBloco() +
        (numRec(rec) ? ' ' + numRec(rec) : '') + '</span>' +
        '<b>' + contaTexto(total, 'atualização registrada', 'atualizações registradas') +
        ' nas ações deste plano</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    corpoHistorico(itens) +
    '<footer class="mo-rodape">' +
      '<button class="btn-primario" data-fechar="1">Fechar</button>' +
    '</footer>' +
  '</div>';
}

function ligaModal(a){
  const box = $('#modal');
  box.querySelectorAll('[data-fechar]').forEach(b =>
    b.addEventListener('click', () => { fechaModal(); redesenha(); }));
  box.querySelectorAll('[data-editar-daqui]').forEach(b =>
    b.addEventListener('click', () => abreModal('edicao', b.dataset.editarDaqui)));
  ligaHistSel(box);
  ligaRemocaoEvidencia(box, desenhaModal);

  const nova = box.querySelector('#form-nova');
  if(nova){
    nova.addEventListener('submit', ev => ev.preventDefault());
    box.querySelectorAll('[data-criar]').forEach(b =>
      b.addEventListener('click', async () => {
        let criou = false;
        if(!(await gravando(b, async () => { criou = await criaAcaoDaJanela(nova); })) || !criou) return;
        fechaModal();
        navega(state.pagina);
      }));
    return;
  }

  const form = box.querySelector('#form-edicao');
  if(!form) return;
  /* Enter dentro de um campo nao pode submeter a janela: quem grava e o
     botao Salvar edicao, no rodape.                                      */
  form.addEventListener('submit', ev => ev.preventDefault());
  ligaPendentes(form);

  /* O numero digitado vira percentual na hora, na barra logo abaixo. */
  const pct = form.querySelector('[name="f_progresso"]');
  if(pct) pct.addEventListener('input', () => {
    const v = Math.max(0, Math.min(100, parseInt(pct.value, 10) || 0));
    const barra = pct.closest('.campo').querySelector('.pct-barra i');
    if(barra) barra.style.width = v + '%';
  });

  box.querySelectorAll('[data-salvar]').forEach(b =>
    b.addEventListener('click', async () => {
      /* Na atualizacao da secretaria o nome de quem registra e obrigatorio. */
      if(form.f_autor && !form.f_autor.value.trim()){
        $('#erro-autor').hidden = false;
        form.f_autor.focus();
        return;
      }
      const valores = {};
      CAMPOS_ACAO.forEach(c => {
        const el = form.querySelector('[name="f_' + c.id + '"]');
        if(!el) return;
        valores[c.id] = c.tipo === 'percentual'
          ? String(Math.max(0, Math.min(100, parseInt(el.value, 10) || 0)))
          : el.value.trim();
      });
      /* evidencia e autor so existem na atualizacao da secretaria. Os
         arquivos acompanham a evidencia: sem texto, nao ha onde anexa-los. */
      const texto = form.f_evtexto ? form.f_evtexto.value.trim() : '';
      const arquivos = anexosPendentes().slice();
      if(arquivos.length && !texto){
        mostraErro(new Error('Descreva a evidência para anexar os arquivos.'));
        form.f_evtexto.focus();
        return;
      }
      const grava = () => salvaEdicaoAcao(a.codigo, a, valores, form.f_autor ? form.f_autor.value : '',
        texto ? { data: form.f_evdata.value || isoHoje(), texto: texto } : null, arquivos);
      if(!(await gravando(b, grava))) return;
      fechaModal();
      navega(state.pagina);
    }));
}

/* A aba Evidências deixou de existir: a evidência vive dentro da ação, é
   exibida na seção Evidências do cartão e registrada na janela de edição. */
const tamanhoArq = b =>
  b < 1024 ? b + ' B' : (b < 1048576 ? Math.round(b / 1024) + ' KB' : (b / 1048576).toFixed(1) + ' MB');

/* Anexo de evidencia. O arquivo fica no Storage; o clique pede ao servidor
   um link temporario e baixa com o nome original (ver abreAnexo).       */
const chipAnexo = x => (x.caminho
    ? '<a class="anexo" href="#" data-anexo="' + esc(x.caminho) + '" data-nome="' + esc(x.nome) +
      '" title="Baixar ' + esc(x.nome) + '">'
    : '<span class="anexo">') +
  svg('arquivo') + esc(x.nome) + '<em>' + tamanhoArq(x.tamanho) + '</em>' + (x.caminho ? '</a>' : '</span>');

async function abreAnexo(el){
  try{
    const url = await srv.linkAnexo(el.dataset.anexo, el.dataset.nome);
    const a = document.createElement('a');
    a.href = url; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }catch(e){ mostraErro(e); }
}

/* Mensagem de erro do servidor. Com janela aberta, aparece no rodape
   dela; sem janela, num aviso do navegador.                           */
function mostraErro(e){
  const msg = (e && e.message) || 'Não foi possível concluir a operação.';
  const rodape = document.querySelector('#modal:not([hidden]) .mo-rodape');
  if(!rodape){ alert(msg); return; }
  let p = document.getElementById('erro-api');
  if(!p){
    p = document.createElement('p');
    p.id = 'erro-api'; p.className = 'mo-erro'; p.setAttribute('role', 'alert');
    p.style.margin = '0 auto 0 0';
    rodape.insertBefore(p, rodape.firstChild);
  }
  p.textContent = msg;
}

/* Trava o botao enquanto a gravacao vai ao servidor, para nao gravar duas
   vezes. Devolve false se der erro (a mensagem ja foi mostrada).        */
async function gravando(botao, tarefa){
  const rotulo = botao ? botao.innerHTML : '';
  if(botao){ botao.disabled = true; botao.textContent = 'Salvando...'; }
  try{ await tarefa(); return true; }
  catch(e){ mostraErro(e); return false; }
  finally{ if(botao && botao.isConnected){ botao.disabled = false; botao.innerHTML = rotulo; } }
}

/* ================================================================
   CONFIGURACOES DA COORDENACAO (perfil SEFA)
   Tres cadastros, na ordem em que dependem uns dos outros: a
   secretaria, o estudo dentro dela e a recomendacao dentro do
   piloto, mais as acoes de cada recomendacao. Excluir manda o item para
   a aba Apagados, de onde ele volta com Restaurar ou sai de vez com
   Apagar definitivamente. O estudo e a recomendacao encerrados vao para
   a aba Arquivados, so para consulta.
   ================================================================ */
const ABAS_CFG = [
  ['secretarias',  'Secretarias'],
  ['pilotos',      'Estudos da Qualidade do Gasto'],
  ['recomendacoes', 'Recomendações'],
  ['acoes',        'Ações'],
  ['arquivados',   'Arquivados'],
  ['apagados',     'Apagados'],
  ['cadastros',    'Cadastros']
];

function paginaConfig(){
  const corpo = state.cfg === 'pilotos'       ? cfgPilotos()
              : state.cfg === 'recomendacoes' ? cfgRecomendacoes()
              : state.cfg === 'acoes'         ? cfgAcoes()
              : state.cfg === 'cadastros'     ? cfgCadastros()
              : state.cfg === 'arquivados'    ? cfgArquivados()
              : state.cfg === 'apagados'      ? cfgApagados()
                                              : cfgSecretarias();
  const qt = { arquivados: itensArquivados().length, apagados: itensApagados().length };
  const aviso = state.cfgAviso
    ? '<div class="cfg-aviso">' + svg('ok') + '<span>' + state.cfgAviso.texto + '</span>' +
        (state.cfgAviso.campos
          ? '<button class="btn-acao" data-cfgdesfazer="1">' + svg('desfazer') + 'Desfazer</button>' : '') +
      '</div>'
    : '';
  return '<h1 class="page-hello">Configurações</h1>' +
    '<p class="page-date">Coordenação do programa · cadastro das secretarias, dos Estudos da Qualidade do Gasto, ' +
      'das recomendações, das ações e dos usuários, com o que foi arquivado e o que foi apagado</p>' +
    '<div class="cfg-abas">' + ABAS_CFG.map(a =>
      '<button' + (state.cfg === a[0] ? ' class="active"' : '') + ' data-cfg="' + a[0] + '">' +
        a[1] + (qt[a[0]] ? '<span class="qt">' + qt[a[0]] + '</span>' : '') + '</button>').join('') + '</div>' +
    aviso + corpo;
}

/* Escolha da secretaria, do estudo e da recomendacao, usada nas abas que
   dependem delas. Estudo e recomendacao arquivados nao entram: ficam na
   aba Arquivados.                                                        */
function cfgEscolha(comPiloto, comRec){
  const os = orgaos().filter(o => o.tipo !== 'sefa');
  if(!state.cfgOrg || !os.some(o => o.id === state.cfgOrg)) state.cfgOrg = os[0] && os[0].id;
  const ps = state.cfgOrg ? pilotos(state.cfgOrg, true).filter(p => !p.arquivado) : [];
  if(comPiloto && (!state.cfgPil || !ps.some(p => p.id === state.cfgPil)))
    state.cfgPil = ps[0] && ps[0].id;
  const rs = (comRec && state.cfgOrg && state.cfgPil)
    ? recomendacoes(state.cfgOrg, state.cfgPil).filter(r => !r.arquivado) : [];
  if(comRec && !rs.some(r => r.numero === state.cfgRec)) state.cfgRec = rs[0] ? rs[0].numero : null;
  const seletorRec = comRec
    ? '<label class="campo"><span>Recomendação</span><select data-cfgrec="1">' +
        (rs.length ? rs.map(r => '<option value="' + r.numero + '"' + (r.numero === state.cfgRec ? ' selected' : '') +
          '>' + numRec(r) + ' · ' + esc(r.titulo) + '</option>').join('')
         : '<option value="">Nenhuma recomendação em acompanhamento</option>') +
      '</select></label>'
    : '';

  return '<div class="cfg-escolha">' +
    '<label class="campo"><span>Secretaria</span><select data-cfgorg="1">' +
      os.map(o => '<option value="' + o.id + '"' + (o.id === state.cfgOrg ? ' selected' : '') + '>' +
        esc(o.sigla) + ' · ' + esc(o.nome) + '</option>').join('') +
    '</select></label>' +
    (comPiloto
      ? '<label class="campo"><span>Estudo da Qualidade do Gasto</span><select data-cfgpil="1">' +
          (ps.length ? ps.map(p => '<option value="' + p.id + '"' +
            (p.id === state.cfgPil ? ' selected' : '') + '>' + esc(p.nome) +
            (p.oculto ? ' (fora do ar)' : '') + '</option>').join('')
           : '<option value="">Nenhum estudo cadastrado</option>') +
        '</select></label>'
      : '') +
    seletorRec +
  '</div>';
}

/* Cartao de um item do cadastro, igual em todas as abas. Os botoes vem
   prontos de quem chama, porque mudam de aba para aba.                  */
function cfgItem(o){
  return '<article class="cfg-item' + (o.esmaecido ? ' is-oculto' : '') + (o.classe ? ' ' + o.classe : '') + '">' +
    '<div class="cfg-top">' +
      (o.cod ? '<span class="cod">' + esc(o.cod) + '</span>' : '') +
      '<h3>' + ouDefinir(esc(o.titulo)) + '</h3>' +
      (o.selos || '') +
    '</div>' +
    (o.meta ? '<p class="cfg-meta">' + o.meta + '</p>' : '') +
    '<div class="acao-acoes">' + o.botoes + '</div>' +
  '</article>';
}
const btnCfg = (attr, chave, icone, rotulo, classe) =>
  '<button class="btn-acao' + (classe ? ' ' + classe : '') + '" data-' + attr + '="' + esc(chave) + '">' +
  svg(icone) + rotulo + '</button>';
const btnEditar  = chave => btnCfg('cfgeditar', chave, 'lapis', 'Editar');
const btnExcluir = chave => btnCfg('cfgexcluir', chave, 'lixeira', 'Excluir', 'neutra');

function cfgSecretarias(){
  const os = orgaos();
  const lista = os.map(o => {
    const ps = pilotos(o.id, true), arq = ps.filter(p => p.arquivado).length;
    return cfgItem({
      cod: o.sigla,
      titulo: o.orgao,
      selos: (o.tipo === 'sefa' ? '<span class="badge b-ciclo">Coordenação</span>' : '') +
             (o.criado ? '<span class="badge b-nova">' + svg('mais') + 'Cadastrada aqui</span>' : ''),
      meta: esc(o.nome) + (o.tipo === 'sefa' ? '' : ' · ' + contaTexto(ps.length - arq,
        'Estudo da Qualidade do Gasto', 'Estudos da Qualidade do Gasto') +
        (arq ? ' · ' + contaTexto(arq, 'arquivado', 'arquivados') : '')),
      botoes: btnEditar('org|' + o.id) + (o.tipo === 'sefa' ? '' : btnExcluir('org|' + o.id))
    });
  }).join('');

  const n = os.filter(o => o.tipo !== 'sefa').length;
  return '<div class="pl-bar"><div class="pl-resumo">' +
      '<b>' + n + '</b> ' + (n === 1 ? 'secretaria cadastrada' : 'secretarias cadastradas') +
      ', além da coordenação</div></div>' +
    lista +
    '<button class="ev-add" data-cfgnovo="org">' + svg('mais') + 'Adicionar secretaria</button>';
}

function cfgPilotos(){
  const escolha = cfgEscolha(false);
  if(!state.cfgOrg) return escolha + '<p class="ev-vazio">Cadastre uma secretaria primeiro.</p>';
  const ps = pilotos(state.cfgOrg, true).filter(p => !p.arquivado);
  const lista = ps.length
    ? ps.map(p => {
        const chave = 'pil|' + state.cfgOrg + '|' + p.id;
        return cfgItem({
          titulo: p.nome,
          esmaecido: p.oculto,
          selos: (p.doRelatorio
            ? '<span class="badge b-ciclo">Do relatório final</span>'
            : '<span class="badge b-nova">' + svg('mais') + 'Cadastrado aqui</span>') +
            (p.oculto ? '<span class="badge b-aguardando">' + svg('olhoOff') + 'Fora do ar</span>' : ''),
          meta: ouDefinir(esc(p.programa)) + ' · ' +
                contaTexto(recomendacoes(state.cfgOrg, p.id).length, 'recomendação', 'recomendações') +
                ' · Ponto focal para acompanhamento: ' + pontoFocal(p),
          botoes: btnEditar(chave) +
            btnCfg('cfgar', chave, p.oculto ? 'olho' : 'olhoOff', p.oculto ? 'Colocar no ar' : 'Tirar do ar', 'neutra') +
            btnCfg('cfgarquivar', chave, 'arquivar', 'Arquivar', 'neutra') +
            btnExcluir(chave)
        });
      }).join('')
    : '<p class="ev-vazio">Nenhum Estudo da Qualidade do Gasto em andamento nesta secretaria.</p>';

  return escolha +
    '<div class="pl-nota">' + svg('info') +
      '<span>O que se edita aqui é o que a secretaria vê no bloco <b>Sobre o estudo</b>, ' +
      'na página Início. <b>Tirar do ar</b> esconde o estudo da secretaria enquanto ele está em preparação. ' +
      '<b>Arquivar</b> guarda um estudo encerrado: ele sai do acompanhamento e continua disponível para consulta. ' +
      '<b>Excluir</b> manda o estudo para Apagados.</span></div>' +
    lista +
    '<button class="ev-add" data-cfgnovo="pil">' + svg('mais') + 'Adicionar Estudo da Qualidade do Gasto</button>';
}

function cfgRecomendacoes(){
  const escolha = cfgEscolha(true);
  if(!state.cfgOrg || !state.cfgPil)
    return escolha + '<p class="ev-vazio">Cadastre um Estudo da Qualidade do Gasto nesta secretaria primeiro.</p>';
  const rs = recomendacoes(state.cfgOrg, state.cfgPil).filter(r => !r.arquivado);
  const lista = rs.length
    ? rs.map(r => {
        const chave = 'rec|' + state.cfgOrg + '|' + state.cfgPil + '|' + r.rid;
        return cfgItem({
          cod: 'Recomendação ' + numRec(r),
          titulo: r.titulo,
          botoes: btnEditar(chave) +
                  btnCfg('cfgarquivar', chave, 'arquivar', 'Arquivar', 'neutra') +
                  btnExcluir(chave),
          selos: r.doRelatorio
            ? '<span class="badge b-ciclo">Do relatório final</span>'
            : '<span class="badge b-nova">' + svg('mais') + 'Cadastrada aqui</span>',
          meta: ouDefinir(esc(r.chamada)) + ' · ' + contaTexto(acoesDaRec(r).length, 'ação', 'ações')
        });
      }).join('')
    : '<p class="ev-vazio">Nenhuma recomendação em acompanhamento neste Estudo da Qualidade do Gasto.</p>';

  return escolha +
    '<div class="pl-nota">' + svg('info') +
      '<span><b>Arquivar</b> guarda uma recomendação encerrada: ela sai do acompanhamento e continua ' +
      'disponível para consulta. <b>Excluir</b> manda a recomendação para Apagados.</span></div>' +
    lista +
    '<button class="ev-add" data-cfgnovo="rec">' + svg('mais') + 'Adicionar recomendação</button>';
}

/* ---- acoes -----------------------------------------------------------------
   A coordenacao edita a ficha das acoes de qualquer estudo, pela mesma
   janela da secretaria, e cria acoes novas. Cada edicao entra no historico
   da acao marcada como edicao da coordenacao.                             */
function cfgAcoes(){
  const escolha = cfgEscolha(true, true);
  if(!state.cfgOrg || !state.cfgPil)
    return escolha + '<p class="ev-vazio">Cadastre um Estudo da Qualidade do Gasto nesta secretaria primeiro.</p>';
  const rec = recomendacoes(state.cfgOrg, state.cfgPil).filter(r => r.numero === state.cfgRec && !r.arquivado)[0];
  if(!rec)
    return escolha + '<p class="ev-vazio">Nenhuma recomendação em acompanhamento neste Estudo da Qualidade do Gasto.</p>';
  const est   = leEstado(state.cfgOrg, state.cfgPil);
  const acoes = acoesDaRec(rec);
  const base  = state.cfgOrg + '|' + state.cfgPil + '|';
  const lista = acoes.length
    ? acoes.map(a => {
        const e = est[a.codigo], k = acaoStatus(a, e), st = STATUS_ACAO[k];
        const v = c => valorCampo(a, e, c);
        const nh = historicoDe(e).length;
        return cfgItem({
          cod: codAcao(a.codigo, state.cfgOrg, state.cfgPil),
          titulo: v('titulo'),
          selos: selosCiclo(a) + seloNova(a) +
            '<span class="badge b-' + k + '">' + svg(st.icone) + st.rotulo + '</span>' +
            (acaoAtrasada(a, e) ? '<span class="badge b-atraso">' + svg('alerta') + 'Atrasada</span>' : ''),
          meta: '<b>Responsável:</b> ' + ouDefinir(esc(v('responsavel'))) +
                ' · <b>Prazo pactuado:</b> ' + ouDefinir(dataBR((e && e.prazo) || '')) +
                ' · <b>Progresso:</b> ' + progressoAcao(a, e) + '%',
          botoes: btnCfg('cfgacao', base + a.codigo, 'lapis', 'Editar') +
                  '<button class="btn-acao neutra" data-cfghist="' + esc(base + a.codigo) + '">' + svg('historico') +
                    'Histórico' + (nh ? '<span class="qt">' + nh + '</span>' : '') + '</button>' +
                  btnCfg('cfgarquivar', 'aca|' + base + a.codigo, 'arquivar', 'Arquivar', 'neutra') +
                  btnExcluir('aca|' + base + a.codigo)
        });
      }).join('')
    : '<p class="ev-vazio">Nenhuma ação em acompanhamento nesta recomendação.</p>';
  const nArq = acoesArquivadasDaRec(rec).length;
  const notaArq = nArq
    ? '<p class="cfg-meta" style="margin:12px 0 0">' + contaTexto(nArq, 'ação arquivada', 'ações arquivadas') +
      ' desta recomendação ' + (nArq === 1 ? 'está' : 'estão') + ' na aba Arquivados.</p>'
    : '';

  return escolha +
    '<div class="pl-nota">' + svg('info') +
      '<span>A coordenação faz a <b>edição estrutural</b> da ação: título, descrição, responsáveis, produto, ' +
      'resultado e prazo pactuado. Essa edição não entra no histórico. Situação, progresso, justificativa e ' +
      'evidências são atualizados pela secretaria, no Plano de Ação. <b>Arquivar</b> tira a ação do ' +
      'acompanhamento e a mantém para consulta.</span></div>' +
    lista + notaArq +
    '<button class="ev-add" data-cfgnovaacao="' + esc(base + rec.numero) + '">' + svg('mais') +
      'Adicionar ação à Recomendação ' + numRec(rec) + '</button>';
}

const contaTexto = (n, s, p) => n + ' ' + (n === 1 ? s : p);

/* ---- arquivados e apagados ---------------------------------------------- */
/* Estudos, recomendacoes e acoes arquivados. O que esta dentro de um item
   tambem arquivado nao aparece a parte: vai junto com ele.               */
function itensArquivados(){
  const out = [];
  orgaos().filter(o => o.tipo !== 'sefa').forEach(o =>
    pilotos(o.id, true).forEach(p => {
      if(p.arquivado){ out.push({ tipo:'Estudo', o:o, p:p, em:p.arquivadoEm }); return; }
      recomendacoes(o.id, p.id).forEach(r => {
        if(r.arquivado){ out.push({ tipo:'Recomendação', o:o, p:p, r:r, em:r.arquivadoEm }); return; }
        acoesArquivadasDaRec(r).forEach(a => out.push({ tipo:'Ação', o:o, p:p, r:r, a:a,
          em:marcaAcao(o.id, p.id, a.codigo).arquivadoEm }));
      });
    }));
  return out.sort((x, y) => String(y.em || '').localeCompare(String(x.em || '')));
}

/* Tudo o que esta em Apagados, do mais recente para o mais antigo. Item
   dentro de outro item apagado aparece com o aviso, porque restaura-lo
   sozinho nao o traz de volta.                                          */
function itensApagados(){
  const out = [];
  orgaosTodos().filter(o => o.tipo !== 'sefa').forEach(o => {
    const ps = pilotosTodos(o.id);
    if(o.apagado)
      out.push({ tipo:'Secretaria', chave:'org|' + o.id, cod:o.sigla, titulo:o.orgao, em:o.apagadoEm,
        ctx: esc(o.nome) + ' · ' + contaTexto(ps.filter(p => !p.apagado).length,
          'Estudo da Qualidade do Gasto vai junto', 'Estudos da Qualidade do Gasto vão junto') });
    ps.forEach(p => {
      if(p.apagado)
        out.push({ tipo:'Estudo', chave:'pil|' + o.id + '|' + p.id, cod:o.sigla, titulo:p.nome, em:p.apagadoEm,
          ctx: 'Estudo da Qualidade do Gasto da ' + esc(o.sigla) +
               (o.apagado ? ' · a secretaria também está em Apagados' : '') });
      const fora = (o.apagado || p.apagado) ? ' · o estudo também está em Apagados' : '';
      const est  = leEstado(o.id, p.id);
      const marcas = {};
      recomendacoesTodas(o.id, p.id).forEach(r => acoesDaRec(r, null, true).forEach(a => {
        marcas[a.codigo] = marcaAcao(o.id, p.id, a.codigo); }));
      recomendacoesTodas(o.id, p.id).forEach(r => {
        if(r.apagado)
          out.push({ tipo:'Recomendação', chave:'rec|' + o.id + '|' + p.id + '|' + r.rid,
            cod:'Recomendação', titulo:r.titulo, em:r.apagadoEm,
            ctx: esc(o.sigla) + ' · ' + esc(p.nome) + fora });
        acoesDaRec(r, null, true).filter(a => (marcas[a.codigo] || {}).apagado).forEach(a =>
          out.push({ tipo:'Ação', chave:'aca|' + o.id + '|' + p.id + '|' + a.codigo,
            cod:'Ação', titulo:valorCampo(a, est[a.codigo], 'titulo'), em:marcas[a.codigo].apagadoEm,
            ctx: esc(o.sigla) + ' · ' + esc(p.nome) + (numRec(r) ? ' · Recomendação ' + numRec(r) : '') +
                 (r.apagado ? ' · a recomendação também está em Apagados' : fora) }));
      });
    });
  });
  return out.sort((x, y) => String(y.em || '').localeCompare(String(x.em || '')));
}

function cfgArquivados(){
  const xs = itensArquivados();
  const dia = em => em ? ' em ' + diaDeIso(em) : '';
  const lista = xs.length
    ? xs.map(x => {
        const estudo = x.tipo === 'Estudo', acao = x.tipo === 'Ação';
        const chave = estudo ? 'pil|' + x.o.id + '|' + x.p.id
                    : acao   ? 'aca|' + x.o.id + '|' + x.p.id + '|' + x.a.codigo
                             : 'rec|' + x.o.id + '|' + x.p.id + '|' + x.r.rid;
        return cfgItem({
          classe: 'is-arquivado',
          cod: estudo ? 'Estudo · ' + x.o.sigla : acao ? 'Ação' : 'Recomendação',
          titulo: estudo ? x.p.nome
                : acao   ? valorCampo(x.a, leEstado(x.o.id, x.p.id)[x.a.codigo], 'titulo') : x.r.titulo,
          selos: '<span class="badge b-arquivado">' + svg('arquivar') + (estudo ? 'Arquivado' : 'Arquivada') +
                 dia(x.em) + '</span>',
          meta: estudo
            ? ouDefinir(esc(x.p.programa)) + ' · ' +
              contaTexto(recomendacoes(x.o.id, x.p.id).length, 'recomendação', 'recomendações')
            : acao
            ? esc(x.o.sigla) + ' · ' + esc(x.p.nome) + (numRec(x.r) ? ' · Recomendação ' + numRec(x.r) : '')
            : esc(x.o.sigla) + ' · ' + esc(x.p.nome) + ' · ' + contaTexto(acoesDaRec(x.r).length, 'ação', 'ações'),
          botoes: btnCfg('cfgconsultar', x.o.id + '|' + x.p.id, 'olho', 'Consultar') +
                  btnCfg('cfgreativar', chave, 'desfazer', 'Reativar', 'neutra') +
                  btnExcluir(chave)
        });
      }).join('')
    : '<div class="card empty" style="padding:40px 24px"><span class="ic">' + svg('arquivar') + '</span>' +
        '<h3>Nada arquivado</h3><p>Estudos, recomendações e ações encerrados vêm para cá pelo botão Arquivar, nas ' +
        'abas Estudos da Qualidade do Gasto, Recomendações e Ações.</p></div>';
  return '<div class="pl-nota">' + svg('info') +
      '<span>Estudos, recomendações e ações que já terminaram. Saem da Visão geral e das Próximas entregas e ficam ' +
      'disponíveis para consulta: a coordenação vê em <b>Estudos</b> e a secretaria vê o plano sem poder editar. ' +
      '<b>Reativar</b> devolve o item ao acompanhamento.</span></div>' + lista;
}

function cfgApagados(){
  const xs = itensApagados();
  const lista = xs.length
    ? xs.map(x => cfgItem({
        classe: 'is-apagado',
        cod: (x.tipo === 'Recomendação' || x.tipo === 'Ação') ? x.cod : x.tipo + ' · ' + x.cod,
        titulo: x.titulo,
        selos: '<span class="badge b-atraso">' + svg('lixeira') + 'Apagado' +
               (x.em ? ' em ' + diaDeIso(x.em) : '') + '</span>',
        meta: x.ctx,
        botoes: btnCfg('cfgrestaurar', x.chave, 'desfazer', 'Restaurar') +
                btnCfg('cfgdefinitivo', x.chave, 'lixeira', 'Apagar definitivamente', 'perigo')
      })).join('')
    : '<div class="card empty" style="padding:40px 24px"><span class="ic">' + svg('lixeira') + '</span>' +
        '<h3>Nada em Apagados</h3><p>O que for excluído nas outras abas vem para cá e pode ser restaurado.</p></div>';
  return '<div class="pl-bar"><div class="pl-resumo"><b>' + xs.length + '</b> ' +
      (xs.length === 1 ? 'item apagado' : 'itens apagados') + '</div>' +
      (xs.length ? '<button class="btn-acao perigo" data-cfgdefinitivo="*" style="margin-left:auto">' +
        svg('lixeira') + 'Esvaziar Apagados</button>' : '') + '</div>' +
    '<div class="pl-nota">' + svg('info') +
      '<span>Itens apagados saem da tela de acesso, das telas das secretarias e do acompanhamento da ' +
      'coordenação. O que a secretaria registrou neles continua guardado até a exclusão definitiva. ' +
      '<b>Restaurar</b> devolve o item como estava.</span></div>' + lista;
}

/* Nome curto de um cadastro, para os avisos. */
function nomeCfg(chave){
  const p = chave.split('|');
  if(p[0] === 'org') return (orgaoPorId(p[1]) || {}).sigla || 'Secretaria';
  if(p[0] === 'pil') return (pilotoPorId(p[1], p[2]) || {}).nome || 'Estudo';
  if(p[0] === 'aca') return ('Ação ' + codAcao(p[3], p[1], p[2])).trim();
  const r = recomendacoesTodas(p[1], p[2]).filter(x => x.rid === p[3])[0];
  return numRec(r) ? 'Recomendação ' + numRec(r) : 'Recomendação';
}

/* Grava campos de estado (apagado, arquivado, oculto) em qualquer um dos
   cadastros, pela chave (org|, pil|, rec| ou aca|). As datas sao do servidor. */
const marcaCfg = (chave, campos) => srv.marcarItem(chave, campos);
/* Excluir e restaurar. No estudo, oculto e o fora do ar e fica como estava. */
const camposExcluir   = () => ({ apagado:true });
const camposRestaurar = () => ({ apagado:false });

/* Apagar definitivamente: o item sai do banco, junto com o que depende dele
   e com o que a secretaria registrou (prazos, situacoes, justificativas,
   evidencias com os arquivos, historico e acoes).                        */
const apagaDefinitivo = chave => srv.apagarDefinitivo(chave);

/* Confirmacao da exclusao definitiva, de um item ou de todos (chave *). */
function janelaCfgApagar(chave){
  const xs = itensApagados();
  const todos = chave === '*';
  const it = todos ? null : xs.filter(x => x.chave === chave)[0];
  if(!todos && !it) return '';
  const extra = todos ? ''
    : it.tipo === 'Secretaria' ? ' Saem também os estudos e as recomendações dessa secretaria.'
    : it.tipo === 'Estudo' ? ' Saem também as recomendações e o plano de ação desse estudo.'
    : it.tipo === 'Ação' ? ''
    : ' Saem também as ações dessa recomendação no plano da secretaria.';
  const qual = todos ? null : ARTIGO_ITEM[it.tipo];
  return '<div class="mo-caixa" role="dialog" aria-modal="true" aria-label="Apagar definitivamente">' +
    '<header class="mo-topo"><div class="tit">' +
      '<span class="mo-eyebrow">' + (todos ? 'Esvaziar Apagados' : 'Apagar definitivamente · ' + it.tipo) + '</span>' +
      '<b>' + (todos ? 'Tem certeza que deseja esvaziar Apagados?'
                     : 'Tem certeza que deseja apagar definitivamente ' + qual.este + '?') + '</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    '<div class="mo-corpo"><section class="mo-grupo">' +
      '<p class="mo-alvo">' + (todos ? contaTexto(xs.length, 'item será apagado para sempre.', 'itens serão apagados para sempre.')
                                     : '<b>' + esc(it.cod) + '</b> ' + esc(it.titulo)) + '</p>' +
      '<p class="mo-perigo">' + svg('alerta') + '<span><b>Esta ação não pode ser desfeita.</b> ' +
        (todos ? 'Tudo o que está em Apagados sai do sistema' : 'O item sai do sistema') +
        ', junto com o que a secretaria registrou ' + (todos ? 'neles' : 'nele') +
        ': prazos, situações, justificativas, evidências e ' +
        'histórico.' + extra + '</span></p>' +
    '</section></div>' +
    '<footer class="mo-rodape">' +
      '<button class="btn-neutro" data-fechar="1">Cancelar</button>' +
      '<button class="btn-perigo" data-cfgsalvar="1">' + svg('lixeira') + 'Apagar definitivamente</button>' +
    '</footer>' +
  '</div>';
}

/* Como chamar cada tipo de item nas perguntas de confirmacao. */
const ARTIGO_ITEM = {
  'Secretaria':   { este:'esta secretaria',   volta:'restaurada' },
  'Estudo':       { este:'este estudo',       volta:'restaurado' },
  'Recomendação': { este:'esta recomendação', volta:'restaurada' },
  'Ação':         { este:'esta ação',         volta:'restaurada' }
};
/* Tipo, codigo e titulo de um item do cadastro, pela chave. */
function itemCfg(chave){
  const p = chave.split('|');
  if(p[0] === 'org'){ const o = orgaoPorId(p[1]) || {}; return { tipo:'Secretaria', cod:o.sigla || '', titulo:o.orgao || '' }; }
  if(p[0] === 'pil'){ const x = pilotoPorId(p[1], p[2]) || {}; return { tipo:'Estudo', cod:(orgaoPorId(p[1]) || {}).sigla || '', titulo:x.nome || '' }; }
  const rs = recomendacoesTodas(p[1], p[2]);
  if(p[0] === 'rec'){ const r = rs.filter(x => x.rid === p[3])[0] || {}; return { tipo:'Recomendação', cod:('Recomendação ' + (numRec(r) || '')).trim(), titulo:r.titulo || '' }; }
  const est = leEstado(p[1], p[2]);
  let a = null;
  rs.forEach(r => { a = a || acoesDaRec(r, null, true).filter(x => x.codigo === p[3])[0] || null; });
  return { tipo:'Ação', cod:('Ação ' + codAcao(p[3], p[1], p[2])).trim(), titulo: a ? valorCampo(a, est[a.codigo], 'titulo') : '' };
}

/* Confirmacao antes de excluir: o item vai para Apagados e pode voltar. */
function janelaCfgExcluir(chave){
  const it = itemCfg(chave), qual = ARTIGO_ITEM[it.tipo];
  const extra = it.tipo === 'Secretaria' ? ' Os estudos dela saem de uso junto.'
              : it.tipo === 'Estudo' ? ' As recomendações e o plano de ação saem de uso junto.'
              : it.tipo === 'Recomendação' ? ' As ações dela saem de uso junto.' : '';
  return '<div class="mo-caixa mo-pequena" role="dialog" aria-modal="true" aria-label="Excluir">' +
    '<header class="mo-topo"><div class="tit">' +
      '<span class="mo-eyebrow">Excluir · ' + it.tipo + '</span>' +
      '<b>Tem certeza que deseja excluir ' + qual.este + '?</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    '<div class="mo-corpo"><section class="mo-grupo">' +
      '<p class="mo-alvo"><b>' + esc(it.cod) + '</b> ' + esc(it.titulo) + '</p>' +
      '<p class="mo-aviso">' + svg('info') + '<span>O item sai de todas as telas e vai para a aba Apagados, ' +
        'em Configurações, de onde pode ser ' + qual.volta + '.' + extra + '</span></p>' +
    '</section></div>' +
    '<footer class="mo-rodape">' +
      '<button class="btn-neutro" data-fechar="1">Cancelar</button>' +
      '<button class="btn-perigo" data-cfgsalvar="1">' + svg('lixeira') + 'Excluir</button>' +
    '</footer>' +
  '</div>';
}

/* ---- janelas do cadastro --------------------------------------------- */
function molduraCfg(titulo, eyebrow, corpo, podeExcluir){
  return '<div class="mo-caixa" role="dialog" aria-modal="true" aria-label="' + titulo + '">' +
    '<header class="mo-topo"><div class="tit">' +
      '<span class="mo-eyebrow">' + eyebrow + '</span><b>' + titulo + '</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    '<form class="mo-corpo" id="form-cfg" novalidate>' + corpo + '</form>' +
    '<footer class="mo-rodape">' +
      (podeExcluir
        ? '<button class="btn-remover" data-cfgexcluir="1">' + svg('lixeira') + 'Excluir</button>' : '') +
      '<button class="btn-neutro" data-fechar="1">Cancelar</button>' +
      '<button class="btn-primario" data-cfgsalvar="1">' + svg('ok') + 'Salvar</button>' +
    '</footer>' +
  '</div>';
}
const campoTexto = (nome, rotulo, valor, dica) =>
  '<label class="campo cresce"><span>' + rotulo + '</span>' +
    '<input type="text" name="' + nome + '" value="' + esc(valor) + '"' +
    (dica ? ' placeholder="' + esc(dica) + '"' : '') + '></label>';
const campoArea = (nome, rotulo, valor, linhas, dica) =>
  '<label class="campo cresce"><span>' + rotulo + '</span>' +
    '<textarea name="' + nome + '" rows="' + linhas + '"' +
    (dica ? ' placeholder="' + esc(dica) + '"' : '') + '>' + esc(valor) + '</textarea></label>';

function janelaCfgOrg(chave){
  const id = (chave || '').split('|')[1];
  const o  = id ? orgaoPorId(id) : { sigla:'', nome:'', orgao:'' };
  return molduraCfg(id ? esc(o.sigla) : 'Nova secretaria',
    id ? 'Editar secretaria' : 'Cadastrar secretaria',
    '<section class="mo-grupo"><h4>Identificação</h4>' +
      '<div class="mo-linha">' +
        campoTexto('f_sigla', 'Sigla', o.sigla, 'SEAB') +
        campoTexto('f_nome', 'Área', o.nome, 'Agricultura e Abastecimento') +
      '</div>' +
      '<div class="mo-linha">' +
        campoTexto('f_orgao', 'Nome completo', o.orgao,
          'Secretaria de Estado da Agricultura e do Abastecimento') +
      '</div>' +
      '<p class="mo-aviso">' + svg('info') + 'A sigla e o nome aparecem na tela de acesso, na barra ' +
        'superior e no rodapé da barra lateral da secretaria.</p>' +
    '</section>', false);
}

function janelaCfgPil(chave){
  const [, orgId, pilId] = (chave || '').split('|');
  const p = pilId ? pilotoPorId(orgId, pilId) : { nome:'', programa:'', acao:'', resumo:[] };
  const o = orgaoPorId(orgId || state.cfgOrg) || {};
  const blocos = (p.resumo || []).concat([['', ''], ['', ''], ['', ''], ['', '']]).slice(0, 4);
  return molduraCfg(pilId ? esc(p.nome) : 'Novo Estudo da Qualidade do Gasto',
    (pilId ? 'Editar Estudo da Qualidade do Gasto' : 'Cadastrar Estudo da Qualidade do Gasto') + ' · ' + esc(o.sigla || ''),
    '<section class="mo-grupo"><h4>Identificação</h4>' +
      '<div class="mo-linha">' + campoTexto('f_nome', 'Nome do estudo', p.nome,
        'Como a secretaria verá o estudo na lista') + '</div>' +
      '<div class="mo-linha">' + campoTexto('f_programa', 'Programa', p.programa,
        'Programa ou política analisada') + '</div>' +
      '<div class="mo-linha">' + campoTexto('f_acao', 'Ação orçamentária', p.acao,
        'Ação e denominação no orçamento') + '</div>' +
    '</section>' +
    '<section class="mo-grupo"><h4>Ponto focal para acompanhamento</h4>' +
      '<div class="mo-linha">' +
        campoTexto('f_farea', 'Área', p.focalArea, 'Área do órgão que é ponto focal do estudo') +
        campoTexto('f_fpessoa', 'Pessoa', p.focalPessoa, 'Responsável pela área') +
      '</div>' +
      '<div class="mo-linha">' +
        campoTexto('f_femail', 'E-mail institucional', p.focalEmail, 'nome@orgao.pr.gov.br') +
      '</div>' +
      '<p class="mo-erro" id="erro-femail" hidden>Informe um e-mail válido ou deixe o campo em branco.</p>' +
      '<p class="mo-aviso">' + svg('info') + 'Interlocutor da SEFA nas reuniões trimestrais. Aparece na página Início da secretaria.</p>' +
    '</section>' +
    '<section class="mo-grupo"><h4>Sobre o estudo, na página Início</h4>' +
      blocos.map((b, k) =>
        '<div class="mo-linha">' +
          campoTexto('f_bt' + k, 'Bloco ' + (k + 1) + ' · título', b[0], 'Do que se trata') +
        '</div><div class="mo-linha">' +
          campoArea('f_bd' + k, 'Bloco ' + (k + 1) + ' · texto', b[1], 3, 'Deixe em branco para omitir') +
        '</div>').join('') +
      '<p class="mo-aviso">' + svg('info') + 'Blocos sem título e sem texto não aparecem.</p>' +
    '</section>', false);
}

function janelaCfgRec(chave){
  const [, orgId, pilId, rid] = (chave || '').split('|');
  /* a numeracao conta tambem as que estao em Apagados, para nao repetir */
  const rs = recomendacoesTodas(orgId || state.cfgOrg, pilId || state.cfgPil);
  const r  = rid ? rs.filter(x => x.rid === rid)[0] : null;
  const nova = { numero: Math.max.apply(null, [0].concat(rs.map(x => x.numero || 0))) + 1,
                 titulo:'', chamada:'', icone:'lista', paragrafos:[] };
  const v = r || nova;
  const icones = ['lista', 'usuarios', 'ajustes', 'moeda', 'folha', 'alvo', 'gota', 'raio',
                  'base', 'grafico', 'doc', 'relogio'];
  /* O numero interno so ordena as recomendacoes; o exibido e automatico. */
  return molduraCfg(rid ? ('Recomendação ' + (numRec(v) || '')).trim() : 'Nova recomendação',
    (rid ? 'Editar recomendação' : 'Cadastrar recomendação') + ' · ' +
      esc((orgaoPorId(orgId || state.cfgOrg) || {}).sigla || ''),
    '<section class="mo-grupo"><h4>Identificação</h4>' +
      '<div class="mo-linha">' +
        '<input type="hidden" name="f_numero" value="' + (v.numero || 1) + '">' +
        '<label class="campo"><span>Ícone</span><select name="f_icone">' +
          icones.map(i => '<option value="' + i + '"' + (i === v.icone ? ' selected' : '') + '>' +
            i + '</option>').join('') + '</select></label>' +
      '</div>' +
      '<div class="mo-linha">' + campoTexto('f_titulo', 'Título', v.titulo,
        'Recomendações para ampliação da cobertura') + '</div>' +
      '<div class="mo-linha">' + campoTexto('f_chamada', 'Chamada', v.chamada,
        'Resumo de uma linha, mostrado no seletor') + '</div>' +
    '</section>' +
    '<section class="mo-grupo"><h4>Texto</h4>' +
      '<div class="mo-linha">' +
        campoArea('f_paragrafos', 'Parágrafos', (v.paragrafos || []).join('\n\n'), 10,
          'Um parágrafo por bloco, separados por uma linha em branco.') +
      '</div>' +
      '<p class="mo-aviso">' + svg('info') + 'Separe os parágrafos por uma linha em branco. ' +
        'É esse texto que a secretaria lê na aba Recomendações.</p>' +
    '</section>', false);
}

/* ---- aba Cadastros: usuarios e niveis de acesso ------------------------
   Gestor e o usuario da SEFA; restrito entra so nas secretarias e nos
   estudos marcados. Secretaria com um estudo so libera esse estudo ao ser
   marcada; com mais de um, os estudos sao escolhidos um a um.             */
const NIVEIS = { gestor:  { rotulo:'Gestor',   selo:'b-ciclo',
                            como:'Usuário da SEFA: entra pela coordenação e por todas as secretarias, alternando entre elas' },
                 restrito:{ rotulo:'Restrito', selo:'b-nao_iniciada',
                            como:'Usuário da secretaria: entra só nas secretarias e nos estudos marcados abaixo' } };
const orgaosComEstudo = () => orgaos().filter(o => o.tipo !== 'sefa')
  .map(o => ({ o:o, ps:pilotos(o.id, true) })).filter(x => x.ps.length);
const ehEu = u => !!(state.usuario && u && state.usuario.email === u.email);

function descreveAcessos(u){
  if(u.nivel === 'gestor') return 'Coordenação (SEFA) e todas as secretarias';
  return Object.keys(u.acessos || {}).map(org => {
    const o = orgaoPorId(org);
    const nomes = estudosPermitidos(u, org).map(id => esc((pilotoPorId(org, id) || {}).nome || ''));
    return o && nomes.length ? '<b>' + esc(o.sigla) + '</b> ' + nomes.join(', ') : '';
  }).filter(Boolean).join(' · ') || A_DEFINIR;
}

/* Filtro da lista por perfil: todos, gestor ou restrito de uma secretaria
   ('restrito|<org>'). O restrito liberado em mais de uma secretaria aparece
   no filtro de cada uma delas.                                            */
const temAcessoAoOrgao = (u, org) => u.nivel === 'restrito' && ((u.acessos || {})[org] || []).length > 0;
function filtroPerfil(f){
  if(f === 'gestor') return u => u.nivel === 'gestor';
  if(String(f).indexOf('restrito|') === 0){ const org = f.slice(9); return u => temAcessoAoOrgao(u, org); }
  return () => true;
}

function cfgCadastros(){
  const us = leUsuarios().slice().sort((a, b) =>
    (a.nivel === b.nivel ? (a.email < b.email ? -1 : 1) : (a.nivel === 'gestor' ? -1 : 1)));
  const g = us.filter(u => u.nivel === 'gestor').length;
  const secs = orgaos().filter(o => o.tipo !== 'sefa');
  const opcoes = [['', 'Todos', us.length], ['gestor', 'Gestor', g]].concat(secs.map(o =>
    ['restrito|' + o.id, 'Restrito - ' + o.sigla, us.filter(u => temAcessoAoOrgao(u, o.id)).length]));
  if(!opcoes.some(x => x[0] === state.cfgUsuFiltro)) state.cfgUsuFiltro = '';
  const vistos = us.filter(filtroPerfil(state.cfgUsuFiltro));
  const filtro = us.length
    ? '<div class="cfg-escolha"><label class="campo"><span>Tipo de perfil</span><select data-cfgusufiltro="1">' +
        opcoes.map(x => '<option value="' + esc(x[0]) + '"' + (x[0] === state.cfgUsuFiltro ? ' selected' : '') + '>' +
          esc(x[1]) + ' (' + x[2] + ')</option>').join('') +
      '</select></label></div>'
    : '';
  const lista = !us.length
    ? '<div class="pl-nota">' + svg('info') + '<span>Nenhum usuário cadastrado. ' +
        '<b>Comece pelo usuário gestor da SEFA.</b></span></div>'
    : vistos.length
    ? vistos.map(u => cfgItem({
        titulo: u.email,
        selos: '<span class="badge ' + NIVEIS[u.nivel].selo + '">' + NIVEIS[u.nivel].rotulo + '</span>' +
               (ehEu(u) ? '<span class="badge b-nova">Você</span>' : ''),
        meta: descreveAcessos(u),
        botoes: btnCfg('usueditar', u.id, 'lapis', 'Editar') + btnCfg('usuexcluir', u.id, 'lixeira', 'Excluir', 'neutra')
      })).join('')
    : '<p class="ev-vazio">Nenhum usuário com este tipo de perfil.</p>';
  return '<div class="pl-bar"><div class="pl-resumo"><b>' + us.length + '</b> ' +
      (us.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados') +
      (us.length ? ' · ' + contaTexto(g, 'gestor', 'gestores') + ' · ' +
                   contaTexto(us.length - g, 'restrito', 'restritos') : '') +
      (state.cfgUsuFiltro ? ' · mostrando <b>' + vistos.length + '</b>' : '') + '</div></div>' +
    filtro + lista +
    '<button class="ev-add" data-usunovo="1">' + svg('mais') + 'Adicionar usuário</button>';
}

function janelaCfgUsu(id){
  const u = id ? leUsuarios().filter(x => x.id === id)[0] : null;
  if(id && !u) return '';
  const v = u || { email:'', nivel: temCadastro() ? 'restrito' : 'gestor', acessos:{} };
  const acessos = orgaosComEstudo().map(x => {
    const lib = (v.acessos || {})[x.o.id] || [], marcada = lib.length > 0;
    const estudos = x.ps.length > 1
      ? '<div class="acesso-est">' + x.ps.map(p =>
          '<label class="chk"><input type="checkbox" name="f_est_' + x.o.id + '" value="' + p.id + '"' +
            (lib.indexOf(p.id) >= 0 ? ' checked' : '') + (marcada ? '' : ' disabled') + '>' +
            '<span>' + esc(p.nome) + '</span></label>').join('') + '</div>'
      : '<p class="acesso-unico">' + esc(x.ps[0].nome) + '</p>';
    return '<div class="acesso-org">' +
      '<label class="chk"><input type="checkbox" name="f_org" value="' + x.o.id + '"' + (marcada ? ' checked' : '') + '>' +
        '<span><b>' + esc(x.o.sigla) + '</b> ' + esc(x.o.orgao) + '</span></label>' + estudos +
    '</div>';
  }).join('');
  return molduraCfg(id ? esc(u.email) : 'Novo usuário',
    id ? 'Editar usuário' : 'Cadastrar usuário',
    '<section class="mo-grupo"><h4>Acesso</h4>' +
      '<div class="mo-linha">' +
        campoTexto('f_email', 'E-mail (login)', v.email, 'nome@orgao.pr.gov.br') +
        '<label class="campo cresce"><span>' + (id ? 'Nova senha' : 'Senha') + '</span>' +
          '<input type="password" name="f_senha" autocomplete="new-password" placeholder="' +
          (id ? 'Deixe em branco para manter a atual' : 'Defina a senha de acesso') + '"></label>' +
      '</div>' +
      '<p class="mo-aviso">' + svg('info') + REGRA_SENHA + '.</p>' +
    '</section>' +
    '<section class="mo-grupo"><h4>Nível de acesso</h4>' +
      '<div class="niveis">' + ['gestor', 'restrito'].map(n =>
        '<label class="nivel"><input type="radio" name="f_nivel" value="' + n + '"' + (v.nivel === n ? ' checked' : '') + '>' +
          '<span><b>' + NIVEIS[n].rotulo + '</b><small>' + NIVEIS[n].como + '</small></span></label>').join('') +
      '</div>' +
    '</section>' +
    '<section class="mo-grupo" id="usu-acessos"' + (v.nivel === 'restrito' ? '' : ' hidden') + '>' +
      '<h4>Secretarias e estudos liberados</h4>' +
      (acessos || '<p class="ev-vazio">Nenhuma secretaria com estudo cadastrado.</p>') +
      '<p class="mo-aviso">' + svg('info') + 'Na secretaria com mais de um estudo, marque os estudos que o usuário acompanha.</p>' +
    '</section>' +
    '<p class="mo-erro" id="erro-usu" hidden></p>', false);
}

function janelaCfgUsuExcluir(id){
  const u = leUsuarios().filter(x => x.id === id)[0];
  if(!u) return '';
  const gestores = leUsuarios().filter(x => x.nivel === 'gestor').length;
  const bloqueio = ehEu(u) ? 'Você não pode excluir o seu próprio acesso.'
                 : (u.nivel === 'gestor' && gestores < 2) ? 'Este é o único gestor cadastrado. Cadastre outro gestor antes de excluí-lo.'
                 : '';
  return '<div class="mo-caixa mo-pequena" role="dialog" aria-modal="true" aria-label="Excluir">' +
    '<header class="mo-topo"><div class="tit">' +
      '<span class="mo-eyebrow">Excluir · Usuário</span>' +
      '<b>' + (bloqueio ? 'Não é possível excluir este usuário' : 'Tem certeza que deseja excluir este usuário?') + '</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    '<div class="mo-corpo"><section class="mo-grupo">' +
      '<p class="mo-alvo"><b>' + NIVEIS[u.nivel].rotulo + '</b> ' + esc(u.email) + '</p>' +
      '<p class="mo-aviso">' + svg('info') + '<span>' + (bloqueio ||
        'O usuário perde o acesso ao sistema. As atualizações que ele registrou continuam no histórico das ações.') +
      '</span></p>' +
    '</section></div>' +
    '<footer class="mo-rodape">' +
      '<button class="btn-neutro" data-fechar="1">' + (bloqueio ? 'Fechar' : 'Cancelar') + '</button>' +
      (bloqueio ? '' : '<button class="btn-perigo" data-cfgsalvar="1">' + svg('lixeira') + 'Excluir</button>') +
    '</footer>' +
  '</div>';
}

/* Grava o cadastro do usuario, com as travas que evitam a SEFA ficar sem
   gestor: o primeiro cadastro e de gestor, e o ultimo gestor nao perde o
   nivel nem sai. A tela confere antes para responder na hora; o servidor
   (Edge Function "usuarios") confere de novo e cria a conta.            */
async function salvaUsuario(m, f){
  const erro = t => { const e = $('#erro-usu'); e.textContent = t; e.hidden = false; return false; };
  const us = leUsuarios(), id = m.codigo;
  const antigo = id ? us.filter(u => u.id === id)[0] : null;
  const email = normEmail(f.f_email.value), senha = f.f_senha.value;
  const nivelEl = f.querySelector('[name="f_nivel"]:checked'), nivel = nivelEl ? nivelEl.value : '';
  if(!emailValido(email)){ f.f_email.focus(); return erro('Informe um e-mail válido para o login.'); }
  if(us.some(u => u.email === email && u.id !== id)) { f.f_email.focus(); return erro('Já existe um usuário com este e-mail.'); }
  /* A regra vale para senha nova; quem so edita outros campos mantem a atual. */
  if(!antigo || senha){
    const falta = faltaNaSenha(senha);
    if(falta){ f.f_senha.focus(); return erro(antigo ? falta.replace('A senha', 'A nova senha') : falta); }
  }
  if(!nivel) return erro('Escolha o nível de acesso.');
  const outrosGestores = us.filter(u => u.nivel === 'gestor' && u.id !== id).length;
  if(nivel !== 'gestor' && !outrosGestores)
    return erro(antigo ? 'Este é o único gestor cadastrado: ele precisa continuar gestor.'
                       : 'O primeiro cadastro precisa ser de um usuário gestor, para a SEFA manter o acesso à coordenação.');
  if(antigo && ehEu(antigo) && nivel !== antigo.nivel) return erro('Você não pode mudar o seu próprio nível de acesso.');
  let acessos = null;
  if(nivel === 'restrito'){
    acessos = {};
    let semEstudo = '';
    Array.from(f.querySelectorAll('[name="f_org"]:checked')).forEach(c => {
      const org = c.value, ps = pilotos(org, true);
      const ids = ps.length > 1
        ? Array.from(f.querySelectorAll('[name="f_est_' + org + '"]:checked')).map(x => x.value)
        : ps.map(p => p.id);
      if(ids.length) acessos[org] = ids;
      else semEstudo = (orgaoPorId(org) || {}).sigla || org;
    });
    if(semEstudo) return erro('Marque ao menos um estudo da ' + semEstudo + ' ou desmarque a secretaria.');
    if(!Object.keys(acessos).length) return erro('Marque ao menos uma secretaria para o usuário restrito.');
  }
  try{
    await srv.salvarUsuario({ id: antigo ? antigo.id : undefined, email:email, senha: senha || undefined,
                              nivel:nivel, acessos:acessos });
  }catch(e){ return erro(e.message); }
  /* Quem editou o proprio e-mail continua identificado na sessao. */
  if(antigo && ehEu(antigo)){
    state.usuario = { email:email, nivel:nivel };
    montaShell();
  }
  state.cfgAviso = { texto: '“' + esc(email) + '” ' + (antigo ? 'foi atualizado.' : 'foi cadastrado.') };
  return true;
}

/* Grava a janela do cadastro no servidor. Devolve false quando falta algo
   no formulario; erro do servidor sobe para quem chama (ligaModalCfg).  */
async function salvaCfg(m){
  if(m.tipo === 'cfgUsuExcluir'){
    const u = leUsuarios().filter(x => x.id === m.codigo)[0];
    await srv.excluirUsuario(m.codigo);
    state.cfgAviso = { texto: '“' + esc(u ? u.email : '') + '” foi excluído e perdeu o acesso.' };
    return true;
  }
  if(m.tipo === 'cfgUsu') return salvaUsuario(m, $('#modal').querySelector('#form-cfg'));
  if(m.tipo === 'cfgExcluir'){
    await marcaCfg(m.codigo, camposExcluir(m.codigo));
    state.cfgAviso = { texto: '“' + esc(nomeCfg(m.codigo)) + '” foi para Apagados.',
                       chave:m.codigo, campos:camposRestaurar(m.codigo) };
    return true;
  }
  if(m.tipo === 'cfgApagar'){
    const chaves = m.codigo === '*' ? itensApagados().map(x => x.chave) : [m.codigo];
    const nome = m.codigo === '*' ? '' : nomeCfg(m.codigo);
    for(const k of chaves) await apagaDefinitivo(k);
    state.cfgAviso = { texto: m.codigo === '*'
      ? contaTexto(chaves.length, 'item apagado definitivamente.', 'itens apagados definitivamente.')
      : '“' + esc(nome) + '” saiu do sistema de vez.' };
    return true;
  }
  const f = $('#modal').querySelector('#form-cfg');
  const val = n => (f[n] ? String(f[n].value).trim() : '');
  const partes = (m.codigo || '').split('|');

  if(m.tipo === 'cfgOrg'){
    if(!val('f_sigla') || !val('f_orgao')){ f.f_sigla.focus(); return false; }
    const id = await srv.salvarOrgao(partes[1], { sigla:val('f_sigla'), nome:val('f_nome'),
                                                  orgao:val('f_orgao') });
    state.cfgOrg = id;
    return true;
  }

  if(m.tipo === 'cfgPil'){
    if(!val('f_nome')){ f.f_nome.focus(); return false; }
    if(val('f_femail') && !emailValido(val('f_femail'))){
      $('#erro-femail').hidden = false; f.f_femail.focus(); return false;
    }
    const orgId = partes[1] || state.cfgOrg;
    const resumo = [0, 1, 2, 3].map(k => [val('f_bt' + k), val('f_bd' + k)])
                               .filter(b => b[0] || b[1]);
    const pilId = await srv.salvarEstudo(orgId, partes[2], { nome:val('f_nome'), programa:val('f_programa'),
      acao:val('f_acao'), resumo:resumo, focalArea:val('f_farea'), focalPessoa:val('f_fpessoa'),
      focalEmail:val('f_femail') });
    state.cfgOrg = orgId; state.cfgPil = pilId;
    return true;
  }

  if(!val('f_titulo')){ f.f_titulo.focus(); return false; }
  const orgId = partes[1] || state.cfgOrg;
  const pilId = partes[2] || state.cfgPil;
  const paras = val('f_paragrafos').split(/\n\s*\n/).map(t => t.trim()).filter(Boolean);
  /* o numero interno de uma recomendacao nova e dado pelo servidor */
  await srv.salvarRecomendacao(orgId, pilId, partes[3], { titulo:val('f_titulo'), chamada:val('f_chamada'),
    icone:val('f_icone') || 'lista', paragrafos:paras });
  state.cfgOrg = orgId; state.cfgPil = pilId;
  return true;
}

function ligaConfig(item){
  $('#page').querySelectorAll('[data-cfg]').forEach(b =>
    b.addEventListener('click', () => { state.cfg = b.dataset.cfg; state.cfgAviso = null; desenhaPagina(item); }));
  $('#page').querySelectorAll('[data-cfgorg]').forEach(el =>
    el.addEventListener('change', () => { state.cfgOrg = el.value; state.cfgPil = null; desenhaPagina(item); }));
  $('#page').querySelectorAll('[data-cfgpil]').forEach(el =>
    el.addEventListener('change', () => { state.cfgPil = el.value; state.cfgRec = null; desenhaPagina(item); }));
  $('#page').querySelectorAll('[data-cfgrec]').forEach(el =>
    el.addEventListener('change', () => { state.cfgRec = parseInt(el.value, 10) || null; desenhaPagina(item); }));
  $('#page').querySelectorAll('[data-cfgusufiltro]').forEach(el =>
    el.addEventListener('change', () => { state.cfgUsuFiltro = el.value; desenhaPagina(item); }));
  /* Acoes: a janela e a mesma da secretaria, apontada para o estudo
     escolhido (state.alvo). Fechar a janela desfaz o alvo.             */
  const abreAcao = (tipo, chave) => {
    const p = chave.split('|');
    state.alvo = { org:p[0], pil:p[1], rec: tipo === 'nova' ? parseInt(p[2], 10) : state.cfgRec };
    abreModal(tipo, tipo === 'nova' ? null : p[2]);
  };
  $('#page').querySelectorAll('[data-cfgacao]').forEach(b =>
    b.addEventListener('click', () => abreAcao('edicao', b.dataset.cfgacao)));
  $('#page').querySelectorAll('[data-cfghist]').forEach(b =>
    b.addEventListener('click', () => abreAcao('historico', b.dataset.cfghist)));
  $('#page').querySelectorAll('[data-cfgnovaacao]').forEach(b =>
    b.addEventListener('click', () => abreAcao('nova', b.dataset.cfgnovaacao)));
  $('#page').querySelectorAll('[data-cfgeditar]').forEach(b =>
    b.addEventListener('click', () => {
      const t = { org:'cfgOrg', pil:'cfgPil', rec:'cfgRec' }[b.dataset.cfgeditar.split('|')[0]];
      abreModal(t, b.dataset.cfgeditar);
    }));
  $('#page').querySelectorAll('[data-cfgnovo]').forEach(b =>
    b.addEventListener('click', () =>
      abreModal({ org:'cfgOrg', pil:'cfgPil', rec:'cfgRec' }[b.dataset.cfgnovo], null)));
  $('#page').querySelectorAll('[data-usunovo]').forEach(b =>
    b.addEventListener('click', () => abreModal('cfgUsu', null)));
  $('#page').querySelectorAll('[data-usueditar]').forEach(b =>
    b.addEventListener('click', () => abreModal('cfgUsu', b.dataset.usueditar)));
  $('#page').querySelectorAll('[data-usuexcluir]').forEach(b =>
    b.addEventListener('click', () => abreModal('cfgUsuExcluir', b.dataset.usuexcluir)));
  /* Cada mudanca de estado deixa um aviso no topo, com Desfazer. */
  const muda = (attr, campos, texto, desfazer) =>
    $('#page').querySelectorAll('[data-' + attr + ']').forEach(b =>
      b.addEventListener('click', async () => {
        const chave = b.getAttribute('data-' + attr);
        const nome  = nomeCfg(chave);
        if(!(await gravando(b, async () => { await marcaCfg(chave, campos(chave)); await recarrega(); }))) return;
        state.cfgAviso = { texto: '“' + esc(nome) + '” ' + texto, chave:chave, campos: desfazer(chave) };
        desenhaPagina(item);
      }));
  /* Excluir pergunta antes: a confirmacao grava e deixa o aviso com Desfazer. */
  $('#page').querySelectorAll('[data-cfgexcluir]').forEach(b =>
    b.addEventListener('click', () => abreModal('cfgExcluir', b.dataset.cfgexcluir)));
  muda('cfgrestaurar', camposRestaurar, 'saiu de Apagados e voltou ao sistema.', camposExcluir);
  muda('cfgarquivar', () => ({ arquivado:true }), 'foi para Arquivados.', () => ({ arquivado:false }));
  muda('cfgreativar', () => ({ arquivado:false }), 'voltou ao acompanhamento.', () => ({ arquivado:true }));
  $('#page').querySelectorAll('[data-cfgar]').forEach(b =>
    b.addEventListener('click', async () => {
      const chave = b.dataset.cfgar, fora = !(pilotoPorId(chave.split('|')[1], chave.split('|')[2]) || {}).oculto;
      if(!(await gravando(b, async () => { await marcaCfg(chave, { oculto: fora }); await recarrega(); }))) return;
      state.cfgAviso = { texto: '“' + esc(nomeCfg(chave)) + '” ' +
        (fora ? 'saiu do ar para a secretaria.' : 'está no ar para a secretaria.'),
        chave:chave, campos:{ oculto: !fora } };
      desenhaPagina(item);
    }));
  $('#page').querySelectorAll('[data-cfgdesfazer]').forEach(b =>
    b.addEventListener('click', async () => {
      const a = state.cfgAviso;
      if(a && a.campos &&
         !(await gravando(b, async () => { await marcaCfg(a.chave, a.campos); await recarrega(); }))) return;
      state.cfgAviso = null;
      desenhaPagina(item);
    }));
  $('#page').querySelectorAll('[data-cfgdefinitivo]').forEach(b =>
    b.addEventListener('click', () => abreModal('cfgApagar', b.dataset.cfgdefinitivo)));
  /* Consultar abre o detalhe do estudo em Estudos: o estudo arquivado, ou o
     estudo da recomendacao arquivada, que aparece no fim do detalhe.     */
  $('#page').querySelectorAll('[data-cfgconsultar]').forEach(b =>
    b.addEventListener('click', () => {
      const q = b.dataset.cfgconsultar.split('|');
      state.sf.arq = !!(pilotoPorId(q[0], q[1]) || {}).arquivado;
      state.sf.estudo = b.dataset.cfgconsultar;
      navega('estudos');
    }));
}

function ligaModalCfg(m){
  const box = $('#modal');
  box.querySelectorAll('[data-fechar]').forEach(b =>
    b.addEventListener('click', () => { fechaModal(); redesenha(); }));
  const form = box.querySelector('#form-cfg');
  if(form) form.addEventListener('submit', ev => ev.preventDefault());
  /* Cadastro de usuario: as secretarias so aparecem no nivel restrito, e os
     estudos de uma secretaria so ficam marcaveis com ela marcada.        */
  if(m.tipo === 'cfgUsu' && form){
    form.querySelectorAll('[name="f_nivel"]').forEach(r => r.addEventListener('change', () => {
      $('#usu-acessos').hidden = form.querySelector('[name="f_nivel"]:checked').value !== 'restrito';
    }));
    form.querySelectorAll('[name="f_org"]').forEach(c => c.addEventListener('change', () => {
      form.querySelectorAll('[name="f_est_' + c.value + '"]').forEach(e => { e.disabled = !c.checked; e.checked = c.checked; });
    }));
  }
  box.querySelectorAll('[data-cfgsalvar]').forEach(b =>
    b.addEventListener('click', async () => {
      let salvou = false;
      if(!(await gravando(b, async () => { salvou = await salvaCfg(m); if(salvou) await recarrega(); })) || !salvou) return;
      fechaModal();
      redesenha();
    }));
}

function paginaVazia(item){
  const p = state.perfil;
  /* A coordenação não acompanha um estudo: ela mantém o cadastro de todos.
     A consolidação das secretarias entra nesta tela numa etapa seguinte. */
  const corpo = (p.tipo === 'sefa' && !foraDoAr(p.id))
    ? '<span class="ic">' + svg('ajustes') + '</span>' +
      '<h3>Coordenação do programa</h3>' +
      '<p>A visão consolidada das secretarias entra aqui. Por ora, a coordenação mantém em ' +
        '<b>Configurações</b> o cadastro das secretarias, dos Estudos da Qualidade do Gasto e das recomendações ' +
        'que cada secretaria acompanha.</p>' +
      '<button class="ev-add" data-ir="config" style="margin-top:4px">' + svg('ajustes') +
        'Abrir Configurações</button>'
    : '<span class="ic">' + svg('obras') + '</span>' +
      '<h3>Em construção</h3>' +
      '<p>Nenhum Estudo da Qualidade do Gasto da ' + esc(p.sigla) + ' está no ar. As recomendações e o plano de ' +
        'ação entram aqui assim que a coordenação cadastrar o estudo.</p>';

  return '<h1 class="page-hello">' + (item.id === 'recomendacoes' ? rotTitulo() : item.rotulo) + '</h1>' +
    '<p class="page-date">' + esc(p.orgao) + ' (' + esc(p.sigla) + ')</p>' +
    '<div class="card empty" style="margin-top:26px">' + corpo + '</div>';
}

/* Piloto no ar, mas ainda sem recomendação cadastrada pela coordenação. */
function paginaSemRecs(item){
  const pil = pilotoAtual(state.perfil.id) || {};
  return '<h1 class="page-hello">' + (item.id === 'recomendacoes' ? rotTitulo() : item.rotulo) + '</h1>' +
    '<p class="page-date">' + esc(pil.nome || '') + '</p>' +
    seletorPiloto() +
    '<div class="card empty" style="margin-top:22px">' +
      '<span class="ic">' + svg('lista') + '</span>' +
      '<h3>Nenhuma ' + rotBloco().toLowerCase() + ' cadastrada</h3>' +
      '<p>Este Estudo da Qualidade do Gasto ainda não tem ' + rotPlural() + ' no sistema. A coordenação da SEFA ' +
        'cadastra as ' + rotPlural() + ' em Configurações, e elas aparecem aqui em seguida.</p>' +
    '</div>';
}

/* ============================================================
   5B. COORDENACAO DA SEFA: VISAO GERAL, ESTUDOS E PROXIMAS ENTREGAS
   Tudo aqui e leitura. A SEFA acompanha os estudos de todas as
   secretarias e nao edita acao: quem atualiza a ficha e a
   secretaria. Os numeros saem das mesmas regras das telas da
   secretaria (situacao, atraso, progresso, evidencias e historico),
   sem nada digitado a parte. A visao geral nao compara secretarias
   por percentual de conclusao, porque o tamanho das acoes varia
   muito de um plano para outro: ela mostra contagens gerais e um
   sinal simples por estudo.
   ============================================================ */
const ehCoordenacao = () =>
  !!(state.perfil && state.perfil.tipo === 'sefa' && !foraDoAr(state.perfil.id));

const DIA_MS = 86400000;
/* Janela, em dias, de "vence em breve" e de "atualizacao recente". */
const JANELA_DIAS = 30;

const chaveEstudo = s => s.orgao + '|' + s.piloto;
const prazoDe     = x => (x.estado && x.estado.prazo) || '';
const diasAte     = iso => Math.round((new Date(iso + 'T00:00:00') - hojeZero()) / DIA_MS);
const isoDia      = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
                         String(d.getDate()).padStart(2, '0');
const diaDeIso    = iso => new Date(iso).toLocaleDateString('pt-BR');
const mesCurto    = d => d.toLocaleDateString('pt-BR', { month:'short' }).replace('.', '');
const semAcento   = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const tituloDe    = x => valorCampo(x.acao, x.estado, 'titulo');
const respDe      = x => [valorCampo(x.acao, x.estado, 'pessoa'),
                          valorCampo(x.acao, x.estado, 'area') || valorCampo(x.acao, x.estado, 'responsavel')]
                         .filter(Boolean).join(' · ');

/* ---- consolidacao ----------------------------------------------------------
   Para cada estudo no ar, as recomendacoes e as acoes com o registro vigente
   da secretaria por cima. Com backend, vira GET /consolidado com esta forma:
     { geradoEm,
       estudos:[{ orgao, sigla, orgaoNome, piloto, nome, programa, acao,
                  rotuloBloco, arquivado, arquivadoEm,
                  recomendacoes:[{ numero, exib, titulo, chamada, cor, arquivado, arquivadoEm,
                  acoes:[{ acao, estado, cod }] }],
                  recsArquivadas:[ mesma forma ] }],
       arquivados:[ mesma forma ] }
   acao e a ficha de origem (relatorio ou criada no sistema) e estado e o
   mesmo objeto que a secretaria grava. A coordenacao so ve o que esta
   rodando: estudo fora do ar, apagado ou sem recomendacao cadastrada fica
   de fora, sem mencao em tela, e acao apagada nao entra. O arquivado vem a
   parte: sai da visao geral e das entregas e continua consultavel em
   Estudos. No estudo em andamento, a recomendacao arquivada vai para
   recsArquivadas e tambem sai das contagens.                              */
function consolida(){
  const estudos = [], arquivados = [];
  orgaos().filter(o => o.tipo !== 'sefa').forEach(o => {
    pilotos(o.id).forEach(p => {
      const recs = recomendacoes(o.id, p.id);
      if(!recs.length) return;
      const todas = recs.map((r, k) => ({
        numero:r.numero, exib:numeracao(o.id, p.id).rec[r.rid] || null,
        titulo:r.titulo, chamada:r.chamada, cor:corRec(r, k),
        arquivado:!!r.arquivado, arquivadoEm:r.arquivadoEm || null,
        acoes: acoesDaRec(r), arquivadas: acoesArquivadasDaRec(r)
      }));
      const s = {
        orgao:o.id, sigla:o.sigla, orgaoNome:o.orgao, piloto:p.id, nome:p.nome,
        programa:p.programa, acao:p.acao, rotuloBloco:p.rotuloBloco || 'Recomendação',
        focalArea:p.focalArea || '', focalPessoa:p.focalPessoa || '', focalEmail:p.focalEmail || '',
        arquivado:!!p.arquivado, arquivadoEm:p.arquivadoEm || null,
        recomendacoes: todas
      };
      const est = leEstado(o.id, p.id);
      todas.forEach(r => {
        r.acoes = r.acoes.map(a => ({ acao:a, estado:est[a.codigo] || null,
                                      cod:numeracao(o.id, p.id).acao[a.codigo] || '' }));
        r.arquivadas = r.arquivadas.map(a => ({ acao:a, estado:est[a.codigo] || null, cod:'',
                                                em:marcaAcao(o.id, p.id, a.codigo).arquivadoEm || null }));
      });
      if(!s.arquivado){
        s.recomendacoes  = todas.filter(r => !r.arquivado);
        s.recsArquivadas = todas.filter(r => r.arquivado);
      } else s.recsArquivadas = [];
      (s.arquivado ? arquivados : estudos).push(s);
    });
  });
  return { geradoEm:new Date().toISOString(), estudos:estudos, arquivados:arquivados };
}
/* Estudo pela chave, em andamento ou arquivado. */
const estudoPorChave = chave => {
  const c = state.consol || {};
  return (c.estudos || []).concat(c.arquivados || []).filter(x => chaveEstudo(x) === chave)[0] || null;
};

/* ---- leitura de um estudo --------------------------------------------------
   Uma acao entra em um so grupo de prazo: dentro do prazo (tem prazo e nao
   esta atrasada, o que inclui as concluidas), atrasada ou sem prazo pactuado.
   O sinal do estudo segue a mesma logica, sem percentual.                  */
function resumoEstudo(s){
  const itens = [];
  s.recomendacoes.forEach(r => r.acoes.forEach(x => itens.push(x)));
  const st       = x => acaoStatus(x.acao, x.estado);
  const atrasada = x => acaoAtrasada(x.acao, x.estado);
  const abertas  = itens.filter(x => st(x) !== 'concluida');
  const hist = [];
  itens.forEach(x => historicoDe(x.estado).forEach(h => hist.push({ h:h, x:x })));
  hist.sort((p, q) => (p.h.em < q.h.em ? 1 : -1));
  const porSit = {};
  Object.keys(STATUS_ACAO).forEach(k => { porSit[k] = itens.filter(x => st(x) === k).length; });
  const futuras = abertas.filter(x => prazoDe(x) && !atrasada(x))
                         .sort((p, q) => prazoDe(p).localeCompare(prazoDe(q)));
  /* Ultima atualizacao e a do acompanhamento pela secretaria: edicao da
     coordenacao e remocao de evidencia entram no historico, mas nao contam
     como sinal de que o estudo esta sendo acompanhado.                  */
  const acomp = hist.filter(o => o.h.tipo === 'edicao' || o.h.tipo === 'rapida');
  const r = {
    itens:itens, abertas:abertas, hist:hist, porSit:porSit,
    ultima:    acomp.length ? acomp[0].h.em : null,
    atrasadas: itens.filter(atrasada),
    comPrazo:  itens.filter(x => prazoDe(x)),
    semPrazo:  itens.filter(x => !prazoDe(x)),
    proxima:   futuras[0] || null
  };
  r.dentro  = r.comPrazo.filter(x => !atrasada(x));
  r.recente = !!r.ultima && (Date.now() - new Date(r.ultima).getTime()) <= JANELA_DIAS * DIA_MS;
  r.sinal   = r.atrasadas.length ? 'atraso'
            : ((abertas.length || !itens.length) && !abertas.some(x => prazoDe(x))) ? 'semprazo'
            : 'emdia';
  return r;
}

const SINAIS = {
  emdia:    { rotulo:'Em dia',             classe:'b-concluida',  icone:'ok',
              como:'nenhuma ação atrasada' },
  atraso:   { rotulo:'Com atraso',         classe:'b-atraso',     icone:'alerta',
              como:'ao menos uma ação com prazo vencido e não concluída' },
  semprazo: { rotulo:'Sem prazo definido', classe:'b-aguardando', icone:'agenda',
              como:'nenhuma ação em aberto tem prazo pactuado, e por isso o atraso não pode ser medido' }
};
const SEM_ATUALIZACAO = { rotulo:'Sem atualização recente', classe:'b-em_execucao', icone:'historico',
                          como:'nada registrado nos últimos ' + JANELA_DIAS + ' dias' };
const selo = s => '<span class="badge ' + s.classe + '">' + svg(s.icone) + s.rotulo + '</span>';
const selosEstudo = r => selo(SINAIS[r.sinal]) + (r.recente ? '' : selo(SEM_ATUALIZACAO));

/* Situacao derivada da recomendacao, igual a da tela da secretaria. */
const SELO_REC = { nao_iniciada:'b-nao_iniciada', em_andamento:'b-em_execucao', concluida:'b-concluida', atrasada:'b-atraso' };
function statusRecSefa(rec){
  const xs = rec.acoes;
  if(!xs.length) return 'nao_iniciada';
  if(xs.some(x => acaoAtrasada(x.acao, x.estado))) return 'atrasada';
  const sts = xs.map(x => acaoStatus(x.acao, x.estado));
  if(sts.every(k => k === 'concluida'))    return 'concluida';
  if(sts.every(k => k === 'nao_iniciada')) return 'nao_iniciada';
  return 'em_andamento';
}

/* Todas as acoes, com o estudo e a recomendacao de cada uma. */
function todasAcoes(){
  const out = [];
  state.consol.estudos.forEach(s => s.recomendacoes.forEach(r => r.acoes.forEach(x => out.push({ s:s, r:r, x:x }))));
  return out;
}
const chaveFicha = it => chaveEstudo(it.s) + '|' + it.x.acao.codigo;
const botaoFicha = (it, rotulo) =>
  '<button class="sf-ver" data-ficha="' + esc(chaveFicha(it)) + '">' + (rotulo || 'Ver ficha') + '</button>';

/* Lista curta de acoes: sigla, codigo, titulo, prazo e acesso a ficha. */
function listaMini(itens, semData){
  return '<ul class="sf-mini">' + itens.map(it => {
    const pz = prazoDe(it.x);
    return '<li style="--rec:' + it.r.cor + '"><span class="sf-sig">' + esc(it.s.sigla) + '</span>' +
      chipCod(it.x.cod) +
      '<span class="tit" title="' + esc(tituloDe(it.x)) + '">' + ouDefinir(esc(tituloDe(it.x))) + '</span>' +
      (pz && !semData ? '<span class="sf-mini-data">' + dataBR(pz) + '</span>' : '') +
      botaoFicha(it) + '</li>';
  }).join('') + '</ul>';
}

/* ================================================================ Visão geral */
function totaisGerais(c){
  const t = { orgaos:0, estudos:c.estudos.length, recs:0, acoes:0,
              dentro:0, atrasadas:0, semPrazo:0, comPrazo:0, atualizados:0 };
  const orgs = {};
  c.estudos.forEach(s => {
    const r = s.res;
    orgs[s.orgao] = true;
    t.recs      += s.recomendacoes.length;
    t.acoes     += r.itens.length;
    t.dentro    += r.dentro.length;
    t.atrasadas += r.atrasadas.length;
    t.semPrazo  += r.semPrazo.length;
    t.comPrazo  += r.comPrazo.length;
    if(r.recente) t.atualizados++;
  });
  t.orgaos = Object.keys(orgs).length;
  return t;
}

const cartaoNumero = (ic, fundo, n, l, sub) =>
  '<div class="card st"><span class="ic ' + fundo + '">' + svg(ic) + '</span>' +
  '<div><div class="n">' + n + '</div><div class="l">' + l + '</div>' +
  (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div></div>';

function barraPrazos(t){
  if(!t.acoes) return '';
  const seg = [
    { k:'dentro', n:t.dentro,    l:'Dentro do prazo' },
    { k:'atraso', n:t.atrasadas, l:'Atrasadas' },
    { k:'sem',    n:t.semPrazo,  l:'Sem prazo pactuado' }
  ];
  const pct = n => Math.round(n / t.acoes * 100) + '%';
  return '<div class="card sf-part">' +
    '<h3>Como estão os prazos das ' + t.acoes + ' ações</h3>' +
    '<div class="sf-barra" role="img" aria-label="' + seg.map(s => s.l + ': ' + s.n).join('; ') + '">' +
      seg.filter(s => s.n).map(s => '<i class="s-' + s.k + '" style="flex:' + s.n + ' 1 0" title="' + s.l + ': ' +
        contaTexto(s.n, 'ação', 'ações') + ' (' + pct(s.n) + ')"></i>').join('') +
    '</div>' +
    '<ul class="sf-leg">' + seg.map(s =>
      '<li><i class="s-' + s.k + '"></i>' + s.l + ' <b>' + s.n + '</b><em>(' + pct(s.n) + ')</em></li>').join('') +
    '</ul>' +
  '</div>';
}

function linhaEstudo(s){
  const r = s.res;
  return '<button class="sf-est-linha" data-estudo="' + esc(chaveEstudo(s)) + '">' +
    '<span class="sf-sig">' + esc(s.sigla) + '</span>' +
    '<span class="sf-est-nome"><b>' + esc(s.nome) + '</b><em>' + esc(s.orgaoNome) + '</em></span>' +
    '<span class="sf-sinais">' + selosEstudo(r) + '</span>' +
    '<span class="sf-dados">' +
      '<span class="sf-dado"><small>Próximo prazo</small>' +
        (r.proxima ? dataBR(prazoDe(r.proxima)) : '<span class="vazio">Nenhum</span>') + '</span>' +
      '<span class="sf-dado"><small>Última atualização</small>' +
        (r.ultima ? diaDeIso(r.ultima) : '<span class="vazio">Sem registro</span>') + '</span>' +
    '</span>' +
    '<span class="sf-seta">' + svg('dir') + '</span>' +
  '</button>';
}

function pontosAtencao(){
  const todos = todasAcoes();
  const st = it => acaoStatus(it.x.acao, it.x.estado);
  const limite = new Date(hojeZero().getTime() + JANELA_DIAS * DIA_MS);
  const grupos = [
    { icone:'alerta', rotulo:'Ações atrasadas',
      dica:'Prazo pactuado vencido e ação ainda não concluída.',
      itens: todos.filter(it => acaoAtrasada(it.x.acao, it.x.estado)) },
    { icone:'agenda', rotulo:'Vencem nos próximos ' + JANELA_DIAS + ' dias', neutro:true,
      dica:'Ações em aberto com prazo entre hoje e ' + limite.toLocaleDateString('pt-BR') + '.',
      itens: todos.filter(it => st(it) !== 'concluida' && prazoDe(it.x) &&
                                diasAte(prazoDe(it.x)) >= 0 && diasAte(prazoDe(it.x)) <= JANELA_DIAS)
                  .sort((p, q) => prazoDe(p.x).localeCompare(prazoDe(q.x))) },
    { icone:'pausa', rotulo:'Aguardando terceiros sem justificativa',
      dica:'A secretaria marcou a espera, mas não registrou o que está sendo aguardado.',
      itens: todos.filter(it => st(it) === 'aguardando' &&
                                !String((it.x.estado || {}).justificativa || '').trim()) },
    { icone:'clipe', rotulo:'Concluídas sem evidência',
      dica:'Ação marcada como concluída sem registro que comprove o produto entregue.',
      itens: todos.filter(it => st(it) === 'concluida' && !evidenciasDe(it.x.estado).length) }
  ];
  return '<div class="card sf-painel"><h3>Pontos de atenção</h3>' +
    '<p class="sub">Clique em cada linha para ver as ações.</p>' +
    grupos.map(g => '<details class="sf-at' + (g.itens.length ? (g.neutro ? ' neutro' : ' tem') : '') + '">' +
      '<summary>' + svg(g.icone) + '<span>' + g.rotulo + '</span><span class="qt">' + g.itens.length + '</span></summary>' +
      '<p class="sf-at-dica">' + g.dica + '</p>' +
      (g.itens.length ? listaMini(g.itens) : '<p class="sf-vazio">Nenhuma ação nesta condição.</p>') +
    '</details>').join('') +
  '</div>';
}

/* Mudancas de uma edicao, em uma linha. Campos curtos mostram o novo valor;
   os de texto longo so dizem que mudaram.                                */
const CAMPOS_CURTOS = ['status', 'prazo', 'progresso'];
function resumoMudancas(h){
  const ms = h.mudancas || [];
  if(!ms.length) return 'Janela salva sem alteração de campo';
  const partes = ms.map(m => CAMPOS_CURTOS.indexOf(m.campo) >= 0
    ? m.rotulo + ': ' + mostraValor(m.campo, m.para)
    : m.campo === 'evidencia' ? 'Evidência anexada'
    : m.campo === 'evidencia_removida' ? 'Evidência removida'
    : m.rotulo + ' (texto atualizado)');
  return partes.slice(0, 3).join('; ') + (partes.length > 3 ? '; e mais ' + (partes.length - 3) : '');
}

function ultimasAtualizacoes(n){
  const todos = [];
  state.consol.estudos.forEach(s => s.res.hist.forEach(o => {
    const r = s.recomendacoes.filter(rr => rr.acoes.indexOf(o.x) >= 0)[0];
    todos.push({ s:s, r:r, x:o.x, h:o.h });
  }));
  todos.sort((p, q) => (p.h.em < q.h.em ? 1 : -1));
  const corpo = todos.length
    ? '<ul class="sf-mini sf-feed">' + todos.slice(0, n).map(t => {
        const d = new Date(t.h.em);
        return '<li style="--rec:' + t.r.cor + '">' +
          '<span class="quando">' + d.toLocaleDateString('pt-BR') +
            '<em>' + d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) + '</em></span>' +
          '<span class="corpo"><span class="linha1"><span class="sf-sig">' + esc(t.s.sigla) + '</span>' +
            chipCod(t.x.cod) +
            '<span class="tit" title="' + esc(tituloDe(t.x)) + '">' + esc(tituloDe(t.x)) + '</span></span>' +
            '<span class="mud">' + resumoMudancas(t.h) + ' · por ' + ouDefinir(esc(t.h.autor)) +
              (t.h.email ? ' (' + esc(t.h.email) + ')' : '') + '</span></span>' +
          botaoFicha(t) + '</li>';
      }).join('') + '</ul>'
    : '<p class="sf-vazio">Nenhuma atualização registrada até agora.</p>';
  return '<div class="card sf-painel"><h3>Últimas atualizações</h3>' +
    '<p class="sub">As edições mais recentes, de todos os estudos.</p>' + corpo + '</div>';
}

function paginaVisaoGeral(){
  const c = state.consol, t = totaisGerais(c);
  return '<div class="sf">' +
    '<h1 class="page-hello">Visão geral dos Estudos da Qualidade do Gasto</h1>' +
    '<p class="page-date">' + dataPorExtenso(new Date()) + '</p>' +

    '<h2 class="section-label">Carteira acompanhada</h2>' +
    '<div class="grid-4">' +
      cartaoNumero('usuarios', 'bg-blue', t.orgaos, 'Órgãos participantes', 'com estudo em acompanhamento') +
      cartaoNumero('doc', 'bg-blue', t.estudos, 'Estudos em acompanhamento', 'com plano de ação no sistema') +
      cartaoNumero('lista', 'bg-blue', t.recs, 'Recomendações', 'nos estudos em acompanhamento') +
      cartaoNumero('plano', 'bg-blue', t.acoes, 'Ações nos planos', 'do relatório e criadas pelas secretarias') +
    '</div>' +

    '<h2 class="section-label">Prazos e atualização</h2>' +
    '<div class="grid-4">' +
      cartaoNumero('ok', 'bg-green', t.dentro, 'Ações dentro do prazo',
        'de ' + contaTexto(t.comPrazo, 'ação com prazo pactuado', 'ações com prazo pactuado')) +
      cartaoNumero('alerta', 'bg-red', t.atrasadas, 'Ações atrasadas', 'prazo vencido e não concluídas') +
      cartaoNumero('agenda', 'bg-cinza', t.semPrazo, 'Ações sem prazo pactuado', 'o atraso não pode ser medido') +
      cartaoNumero('historico', 'bg-info', t.atualizados, 'Estudos atualizados',
        'nos últimos ' + JANELA_DIAS + ' dias, de ' + t.estudos) +
    '</div>' +
    barraPrazos(t) +

    '<h2 class="section-label">Situação de cada estudo</h2>' +
    (c.estudos.length
      ? '<div class="card sf-est">' + c.estudos.map(linhaEstudo).join('') + '</div>'
      : '<div class="card empty"><span class="ic">' + svg('doc') + '</span><h3>Nenhum estudo no ar</h3>' +
        '<p>Os estudos aparecem aqui assim que estiverem no ar em Configurações.</p></div>') +
    '<p class="sf-como"><b>Como ler:</b> ' +
      Object.keys(SINAIS).map(k => '<b>' + SINAIS[k].rotulo + '</b>: ' + SINAIS[k].como).join('. ') + '. ' +
      '<b>' + SEM_ATUALIZACAO.rotulo + '</b>: ' + SEM_ATUALIZACAO.como + '. Clique no estudo para abrir o detalhe.</p>' +

    '<div class="sf-duas">' + pontosAtencao() + ultimasAtualizacoes(8) + '</div>' +
  '</div>';
}

/* ================================================================ Estudos */
function paginaEstudos(){
  const c = state.consol;
  const s = state.sf.estudo && estudoPorChave(state.sf.estudo);
  return s ? detalheEstudo(s) : carteiraEstudos(c);
}

const seloArquivado = s => '<span class="badge b-arquivado">' + svg('arquivar') + 'Arquivado' +
  (s.arquivadoEm ? ' em ' + diaDeIso(s.arquivadoEm) : '') + '</span>';

/* Carteira: em acompanhamento ou arquivados. No arquivado o sinal de prazo
   deixa de importar, e o cartao mostra quantas acoes foram concluidas.   */
function carteiraEstudos(c){
  const arq = !!state.sf.arq && (c.arquivados || []).length > 0;
  const lista = arq ? c.arquivados : c.estudos;
  const cartoes = lista.map(s => {
    const r = s.res;
    return '<article class="card sf-cartao">' +
      '<div class="sf-cartao-topo"><span class="sf-sig">' + esc(s.sigla) + '</span>' +
        (arq ? seloArquivado(s) : selosEstudo(r)) + '</div>' +
      '<div><h3>' + esc(s.nome) + '</h3><p class="org">' + esc(s.orgaoNome) + '</p></div>' +
      (s.acao ? '<p class="orc">' + esc(s.acao) + '</p>' : '') +
      '<dl class="sf-nums">' +
        '<div><dt>' + (s.recomendacoes.length === 1 ? esc(s.rotuloBloco) : 'Recomendações') + '</dt>' +
          '<dd>' + s.recomendacoes.length + '</dd></div>' +
        '<div><dt>Ações</dt><dd>' + r.itens.length + '</dd></div>' +
        (arq ? '<div><dt>Concluídas</dt><dd>' + r.porSit.concluida + '</dd></div>'
             : '<div><dt>Atrasadas</dt><dd>' + r.atrasadas.length + '</dd></div>') +
      '</dl>' +
      '<dl class="sf-datas">' +
        (arq ? '' : '<div><dt>Próximo prazo</dt><dd>' + (r.proxima ? dataBR(prazoDe(r.proxima)) : '<span class="vazio">Nenhum</span>') + '</dd></div>') +
        '<div><dt>Última atualização</dt><dd>' + (r.ultima ? diaDeIso(r.ultima) : '<span class="vazio">Sem registro</span>') + '</dd></div>' +
      '</dl>' +
      '<dl class="sf-datas sf-focal"><div><dt>Ponto focal para acompanhamento</dt><dd>' + pontoFocal(s) + '</dd></div></dl>' +
      '<button class="btn-acao" data-estudo="' + esc(chaveEstudo(s)) + '">' + (arq ? 'Consultar estudo' : 'Abrir estudo') +
        svg('seta') + '</button>' +
    '</article>';
  }).join('');
  const nArq = (c.arquivados || []).length;
  /* A opcao Arquivados so aparece quando existe estudo arquivado. */
  const abas = nArq
    ? '<div class="pl-bar" style="margin:22px 0 0"><div class="pl-views" style="margin-left:0">' +
        '<button data-sfarq="0"' + (arq ? '' : ' class="active"') + '>Em acompanhamento (' + c.estudos.length + ')</button>' +
        '<button data-sfarq="1"' + (arq ? ' class="active"' : '') + '>Arquivados (' + nArq + ')</button>' +
      '</div></div>'
    : '';
  return '<div class="sf">' +
    '<h1 class="page-hello">Estudos</h1>' +
    '<p class="page-date">' + (arq
      ? contaTexto(nArq, 'Estudo da Qualidade do Gasto arquivado, disponível para consulta',
                         'Estudos da Qualidade do Gasto arquivados, disponíveis para consulta')
      : contaTexto(c.estudos.length, 'Estudo da Qualidade do Gasto em acompanhamento',
                                     'Estudos da Qualidade do Gasto em acompanhamento')) + '</p>' +
    abas +
    (lista.length ? '<div class="sf-cartoes">' + cartoes + '</div>'
      : '<div class="card empty" style="margin-top:24px"><span class="ic">' + svg('doc') + '</span>' +
          '<h3>Nenhum estudo em acompanhamento</h3><p>Os estudos aparecem aqui assim que estiverem no ar ' +
          'em Configurações.</p></div>') +
  '</div>';
}

function linhaAcaoSefa(s, r, x){
  const a = x.acao, e = x.estado, k = acaoStatus(a, e), st = STATUS_ACAO[k];
  const pz = prazoDe(x), late = acaoAtrasada(a, e), nEv = evidenciasDe(e).length;
  return '<div class="sf-tab-lin">' +
    chipGrade(x.cod) +
    '<span class="tit"><b>' + ouDefinir(esc(tituloDe(x))) + '</b>' +
      '<em>' + ouDefinir(esc(respDe(x))) + (a.ciclo ? ' · ciclo ' + a.ciclo : '') +
      (a.nova ? (a.origem === 'coordenacao' ? ' · adicionada pela coordenação' : ' · adicionada pelo órgão') : '') + '</em></span>' +
    '<span class="sit" data-rot="Situação"><span class="badge b-' + k + '">' + svg(st.icone) + st.rotulo + '</span>' +
      (late ? '<span class="badge b-atraso">' + svg('alerta') + 'Atrasada</span>' : '') + '</span>' +
    '<span class="pz' + (late ? ' late' : '') + '" data-rot="Prazo">' + ouDefinir(dataBR(pz)) + '</span>' +
    '<span data-rot="Progresso">' + barraProgresso(a, e, true) + '</span>' +
    '<span class="ev" data-rot="Evidências" title="Evidências registradas">' + svg('clipe') + nEv + '</span>' +
    botaoFicha({ s:s, r:r, x:x }) +
  '</div>';
}

/* Data em que a acao foi marcada como concluida, pelo historico. */
function dataConclusao(e){
  const hs = historicoDe(e).filter(h =>
    (h.mudancas || []).some(m => m.campo === 'status' && m.para === 'concluida'));
  return hs.length ? diaDeIso(hs[hs.length - 1].em) : '';
}

function detalheEstudo(s){
  const r = s.res;
  const sit = Object.keys(STATUS_ACAO).map(k =>
      ({ cls:'b-' + k, ic:STATUS_ACAO[k].icone, l:STATUS_ACAO[k].rotulo, n:r.porSit[k] }))
    .concat([{ cls:'b-atraso', ic:'alerta', l:'Atrasadas', n:r.atrasadas.length },
             { cls:'b-aguardando', ic:'agenda', l:'Sem prazo pactuado', n:r.semPrazo.length }]);

  const blocoRec = rec => {
    const k = statusRecSefa(rec), st = STATUS[k];
    return '<section class="card sf-rec" style="--rec:' + rec.cor + '">' +
      '<div class="sf-rec-cab"><div class="sf-rec-tags">' +
        '<span class="tag rec">' + svg('doc') + esc(s.rotuloBloco) + (rec.exib ? ' ' + rec.exib : '') + '</span>' +
        (rec.arquivado && !s.arquivado
          ? '<span class="badge b-arquivado">' + svg('arquivar') + 'Arquivada' +
            (rec.arquivadoEm ? ' em ' + diaDeIso(rec.arquivadoEm) : '') + '</span>'
          : '<span class="badge ' + SELO_REC[k] + '">' + svg(st.icone) + st.rotulo + '</span>') +
        '<span class="pl-resumo">' + contaTexto(rec.acoes.length, 'ação', 'ações') + '</span>' +
      '</div><h3>' + esc(rec.titulo) + '</h3></div>' +
      (rec.acoes.length
        ? '<div class="sf-tab"><div class="sf-tab-cab"><span>Código</span><span>Ação e responsável</span>' +
            '<span>Situação</span><span>Prazo</span><span>Progresso</span><span>Evid.</span><span></span></div>' +
            rec.acoes.map(x => linhaAcaoSefa(s, rec, x)).join('') + '</div>'
        : '<p class="sf-vazio" style="padding:0 20px 6px">Nenhuma ação em acompanhamento nesta recomendação.</p>') +
      ((rec.arquivadas || []).length
        ? '<p class="sf-arq-acoes">' + svg('arquivar') + '<b>' +
            (rec.arquivadas.length === 1 ? 'Ação arquivada' : 'Ações arquivadas') + ':</b> ' +
            rec.arquivadas.map(x => '<span>' + esc(tituloDe(x)) +
              (x.em ? ' (em ' + diaDeIso(x.em) + ')' : '') + '</span>').join(' · ') + '</p>'
        : '') +
    '</section>';
  };
  const recs = s.recomendacoes.map(blocoRec).join('');
  /* Recomendacoes arquivadas: fora das contagens, so para consulta. */
  const arqs = (s.recsArquivadas || []).length
    ? '<h2 class="section-label">' + (s.recsArquivadas.length === 1 ? 'Recomendação arquivada' : 'Recomendações arquivadas') +
        '</h2><p class="sf-intro">Encerradas pela coordenação. Ficam fora das contagens acima e disponíveis para consulta.</p>' +
      s.recsArquivadas.map(blocoRec).join('')
    : '';

  const feitas = [];
  s.recomendacoes.forEach(rec => rec.acoes.forEach(x => {
    if(acaoStatus(x.acao, x.estado) === 'concluida') feitas.push({ s:s, r:rec, x:x });
  }));
  const feito = feitas.length
    ? feitas.map(it => {
        const a = it.x.acao, e = it.x.estado, evs = evidenciasDe(e), quando = dataConclusao(e);
        return '<article class="card sf-feito" style="--rec:' + it.r.cor + '">' +
          '<div class="sf-feito-topo">' + chipCod(it.x.cod) +
            '<span class="badge b-concluida">' + svg('ok') + 'Concluída' + (quando ? ' em ' + quando : '') + '</span>' +
            (evs.length ? '' : '<span class="badge b-atraso">' + svg('alerta') + 'Sem evidência</span>') +
            botaoFicha(it) + '</div>' +
          '<h4>' + esc(tituloDe(it.x)) + '</h4>' +
          '<p class="sf-feito-prod"><b>Produto esperado</b>' + ouDefinir(esc(valorCampo(a, e, 'produto'))) + '</p>' +
          (evs.length ? listaEvidencias(evs) : '') +
        '</article>';
      }).join('')
    : '<div class="card empty" style="padding:34px 24px"><span class="ic">' + svg('ok') + '</span>' +
        '<h3>Nenhuma ação concluída até agora</h3>' +
        '<p>As ações concluídas aparecem aqui com as evidências que a secretaria registrou.</p></div>';

  return '<div class="sf">' +
    '<button class="voltar" data-estudo="">Voltar aos estudos' + (s.arquivado ? ' arquivados' : '') + '</button>' +
    '<h1 class="page-hello">' + esc(s.nome) + '</h1>' +
    '<p class="page-date">' + esc(s.orgaoNome) + ' (' + esc(s.sigla) + ')' + (s.acao ? ' · ' + esc(s.acao) : '') + '</p>' +
    '<div class="card sf-det-cab">' +
      '<div class="sf-sinais">' + (s.arquivado ? seloArquivado(s) : selosEstudo(r)) + '</div>' +
      '<dl class="sf-datas">' +
        '<div><dt>Recomendações</dt><dd>' + s.recomendacoes.length + '</dd></div>' +
        '<div><dt>Ações</dt><dd>' + r.itens.length + '</dd></div>' +
        (s.arquivado
          ? '<div><dt>Concluídas</dt><dd>' + r.porSit.concluida + '</dd></div>'
          : '<div><dt>Próximo prazo</dt><dd>' + (r.proxima ? dataBR(prazoDe(r.proxima)) + (r.proxima.cod ? ' (' + r.proxima.cod + ')' : '')
                                                      : '<span class="vazio">Nenhum</span>') + '</dd></div>') +
        '<div><dt>Última atualização</dt><dd>' + (r.ultima ? diaDeIso(r.ultima) : '<span class="vazio">Sem registro</span>') + '</dd></div>' +
      '</dl>' +
      '<dl class="sf-datas sf-focal"><div><dt>Ponto focal para acompanhamento</dt><dd>' + pontoFocal(s, true) + '</dd></div></dl>' +
      '<button class="btn-acao neutra" data-histestudo="' + esc(chaveEstudo(s)) + '">' + svg('historico') +
        'Histórico de atualizações do estudo' + (r.hist.length ? '<span class="qt">' + r.hist.length + '</span>' : '') +
      '</button>' +
    '</div>' +
    '<h2 class="section-label">Situação das ações</h2>' +
    '<div class="sf-sit">' + sit.map(x =>
      '<div class="card"><span class="badge ' + x.cls + '">' + svg(x.ic) + x.l + '</span>' +
      '<div class="n">' + x.n + '</div></div>').join('') + '</div>' +
    '<h2 class="section-label">' + esc(s.rotuloBloco === 'Recomendação' ? 'Recomendações' : s.rotuloBloco) + ' e ações</h2>' +
    recs +
    '<h2 class="section-label">O que já foi feito</h2>' +
    '<p class="sf-intro">Ações concluídas, com o produto esperado e as evidências registradas pela secretaria.</p>' +
    feito + arqs +
  '</div>';
}

/* ================================================================ Próximas entregas */
const PERIODOS = [
  { id:'atrasadas', rotulo:'Atrasadas',         icone:'alerta', teste: d => d < 0 },
  { id:'7',         rotulo:'Próximos 7 dias',   icone:'agenda', teste: d => d >= 0 && d <= 7 },
  { id:'30',        rotulo:'De 8 a 30 dias',    icone:'agenda', teste: d => d > 7 && d <= 30 },
  { id:'90',        rotulo:'De 31 a 90 dias',   icone:'agenda', teste: d => d > 30 && d <= 90 },
  { id:'depois',    rotulo:'Depois de 90 dias', icone:'agenda', teste: d => d > 90 }
];

/* Acoes em aberto que passam pelos filtros de estudo, situacao e busca. */
function entregasFiltradas(){
  const f = state.sf, q = semAcento(f.q).trim();
  return todasAcoes().filter(it => {
    const k = acaoStatus(it.x.acao, it.x.estado);
    if(k === 'concluida') return false;
    if(f.org && chaveEstudo(it.s) !== f.org) return false;
    if(f.sit && k !== f.sit) return false;
    if(q && semAcento([it.s.sigla, it.s.nome, it.x.cod, tituloDe(it.x), respDe(it.x),
                       valorCampo(it.x.acao, it.x.estado, 'responsavel')].join(' ')).indexOf(q) < 0) return false;
    return true;
  });
}
function noPeriodo(d, per){
  if(!per) return true;
  if(per === 'atrasadas') return d < 0;
  return d >= 0 && d <= parseInt(per, 10);
}
function contagem(d){
  if(d < 0)   return 'atrasada há ' + contaTexto(-d, 'dia', 'dias');
  if(d === 0) return 'vence hoje';
  if(d === 1) return 'vence amanhã';
  return 'vence em ' + d + ' dias';
}

function linhaEntrega(it){
  const a = it.x.acao, e = it.x.estado, pz = prazoDe(it.x), d = diasAte(pz), late = d < 0;
  const dt = new Date(pz + 'T00:00:00'), k = acaoStatus(a, e), st = STATUS_ACAO[k];
  return '<article class="card sf-ent' + (late ? ' late' : '') + '" style="--rec:' + it.r.cor + '">' +
    '<div class="sf-data"><b>' + dt.getDate() + '</b><span>' + mesCurto(dt) + ' ' + dt.getFullYear() + '</span></div>' +
    '<div class="sf-ent-corpo">' +
      '<div class="sf-ent-topo"><span class="sf-sig">' + esc(it.s.sigla) + '</span>' +
        chipCod(it.x.cod) +
        '<span class="badge b-' + k + '">' + svg(st.icone) + st.rotulo + '</span>' +
        '<span class="sf-conta">' + contagem(d) + '</span></div>' +
      '<h4>' + ouDefinir(esc(tituloDe(it.x))) + '</h4>' +
      '<p>' + ouDefinir(esc(respDe(it.x))) + ' · ' + esc(it.s.nome) + '</p>' +
    '</div>' +
    '<button class="btn-acao neutra" data-ficha="' + esc(chaveFicha(it)) + '">' + svg('olho') + 'Ver ficha</button>' +
  '</article>';
}

function blocoSemPrazo(itens){
  const porEstudo = {};
  itens.forEach(it => { (porEstudo[chaveEstudo(it.s)] = porEstudo[chaveEstudo(it.s)] || []).push(it); });
  return '<section class="sf-grupo"><h3>' + svg('agenda') + 'Em aberto sem prazo pactuado' +
      '<span class="qt">' + itens.length + '</span></h3>' +
    '<p class="sf-at-dica">Sem prazo registrado não há como medir atraso. Agrupadas por estudo.</p>' +
    '<div class="card sf-painel" style="padding-bottom:4px">' +
      Object.keys(porEstudo).map(k => {
        const xs = porEstudo[k], s = xs[0].s;
        return '<details class="sf-at neutro"><summary><span class="sf-sig">' + esc(s.sigla) + '</span>' +
          '<span>' + esc(s.nome) + '</span><span class="qt">' + xs.length + '</span></summary>' +
          listaMini(xs, true) + '</details>';
      }).join('') +
    '</div></section>';
}

function listaEntregas(base){
  const f = state.sf;
  const comPrazo = base.filter(it => prazoDe(it.x))
    .filter(it => noPeriodo(diasAte(prazoDe(it.x)), f.per))
    .sort((p, q) => prazoDe(p.x).localeCompare(prazoDe(q.x)) || p.s.sigla.localeCompare(q.s.sigla));
  const semPrazo = f.per ? [] : base.filter(it => !prazoDe(it.x));
  const atrasadas = comPrazo.filter(it => diasAte(prazoDe(it.x)) < 0).length;

  const resumo = '<p class="pl-resumo sf-res-resumo"><b>' + comPrazo.length + '</b> ' +
    (comPrazo.length === 1 ? 'ação em aberto com prazo' : 'ações em aberto com prazo') +
    (atrasadas ? ' · <b class="tx-red">' + contaTexto(atrasadas, 'atrasada', 'atrasadas') + '</b>' : '') +
    (f.per ? '' : ' · <b>' + semPrazo.length + '</b> sem prazo pactuado') + '</p>';

  if(!comPrazo.length && !semPrazo.length)
    return resumo + '<div class="card empty" style="padding:40px 24px"><span class="ic">' + svg('busca') + '</span>' +
      '<h3>Nenhuma ação com esses filtros</h3><p>Mude o estudo, a situação, o período ou a busca.</p></div>';

  const grupos = PERIODOS.map(g => {
    const xs = comPrazo.filter(it => g.teste(diasAte(prazoDe(it.x))));
    if(!xs.length) return '';
    return '<section class="sf-grupo' + (g.id === 'atrasadas' ? ' g-atrasadas' : '') + '"><h3>' + svg(g.icone) +
      g.rotulo + '<span class="qt">' + xs.length + '</span></h3>' + xs.map(linhaEntrega).join('') + '</section>';
  }).join('');
  const aviso = !comPrazo.length
    ? '<div class="sf-cal-aviso">' + svg('info') + 'Nenhuma ação em aberto tem prazo pactuado ainda. ' +
      'As entregas aparecem aqui assim que as secretarias registrarem os prazos.</div>'
    : '';
  return resumo + aviso + grupos + (semPrazo.length ? blocoSemPrazo(semPrazo) : '');
}

function calendarioEntregas(base){
  const f = state.sf, hoje = hojeZero();
  const chave = f.mes || isoDia(hoje).slice(0, 7);
  const ano = parseInt(chave.slice(0, 4), 10), mes = parseInt(chave.slice(5, 7), 10) - 1;
  const ini = new Date(ano, mes, 1);
  const comPrazo = base.filter(it => prazoDe(it.x));
  const doMes = comPrazo.filter(it => prazoDe(it.x).slice(0, 7) === chave);
  const porDia = {};
  doMes.forEach(it => { (porDia[prazoDe(it.x)] = porDia[prazoDe(it.x)] || []).push(it); });
  const atrasadasMes = doMes.filter(it => acaoAtrasada(it.x.acao, it.x.estado)).length;
  const mesDe = d => isoDia(d).slice(0, 7);
  const nome = ini.toLocaleDateString('pt-BR', { month:'long', year:'numeric' });

  const nav = '<div class="sf-cal-nav">' +
    '<button class="nav" data-sfmes="' + mesDe(new Date(ano, mes - 1, 1)) + '" aria-label="Mês anterior">' + svg('esq') + '</button>' +
    '<h3>' + nome.charAt(0).toUpperCase() + nome.slice(1) + '</h3>' +
    '<button class="nav" data-sfmes="' + mesDe(new Date(ano, mes + 1, 1)) + '" aria-label="Próximo mês">' + svg('dir') + '</button>' +
    '<button class="btn-acao neutra" data-sfmes="' + mesDe(hoje) + '">Hoje</button>' +
    '<span class="pl-resumo"><b>' + doMes.length + '</b> ' + (doMes.length === 1 ? 'entrega' : 'entregas') + ' neste mês' +
      (atrasadasMes ? ' · <b class="tx-red">' + contaTexto(atrasadasMes, 'atrasada', 'atrasadas') + '</b>' : '') + '</span>' +
  '</div>';

  /* Mes vazio: indica a proxima entrega e leva ate ela. */
  let aviso = '';
  if(!doMes.length){
    const prox = comPrazo.map(it => prazoDe(it.x)).filter(p => p.slice(0, 7) > chave).sort()[0];
    aviso = '<div class="sf-cal-aviso">' + svg('info') +
      (prox ? 'Nenhuma entrega neste mês. A próxima é em ' + dataBR(prox) + '.' +
              '<button class="btn-acao" data-sfmes="' + prox.slice(0, 7) + '">Ir para ' +
              new Date(prox + 'T00:00:00').toLocaleDateString('pt-BR', { month:'long', year:'numeric' }) + '</button>'
            : 'Nenhuma entrega neste mês nem nos seguintes.') + '</div>';
  }

  const chip = it => {
    const k = acaoAtrasada(it.x.acao, it.x.estado) ? 'atrasada' : acaoStatus(it.x.acao, it.x.estado);
    return '<button class="sf-chip c-' + k + '" data-ficha="' + esc(chaveFicha(it)) + '" title="' +
      esc(it.s.sigla + (it.x.cod ? ' ' + it.x.cod : '') + ': ' + tituloDe(it.x)) + '">' +
      esc(it.s.sigla) + (it.x.cod ? ' ' + it.x.cod : '') + '<em>' + esc(tituloDe(it.x)) + '</em></button>';
  };
  const semanas = Math.ceil((ini.getDay() + new Date(ano, mes + 1, 0).getDate()) / 7);
  const cels = [];
  for(let i = 0; i < semanas * 7; i++){
    const d = new Date(ano, mes, 1 - ini.getDay() + i);
    const iso = isoDia(d);
    cels.push('<div class="sf-cal-cel' + (d.getMonth() !== mes ? ' fora' : '') +
      (d.getTime() === hoje.getTime() ? ' hoje' : '') + '"><span class="num">' + d.getDate() + '</span>' +
      (d.getMonth() === mes ? (porDia[iso] || []).map(chip).join('') : '') + '</div>');
  }
  const SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const grade = '<div class="sf-cal">' + SEMANA.map(x => '<div class="sf-cal-sem">' + x + '</div>').join('') +
    cels.join('') + '</div>';

  /* Em tela estreita a grade vira agenda: so os dias com entrega. */
  const dias = Object.keys(porDia).sort();
  const agenda = '<div class="sf-agenda">' + (dias.length
    ? dias.map(iso => {
        const t = new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'2-digit' });
        return '<h4 class="sf-ag-dia">' + t + '</h4><div class="card sf-painel" style="padding:4px 14px">' +
          listaMini(porDia[iso], true) + '</div>';
      }).join('')
    : '<p class="sf-vazio">Nenhuma entrega neste mês.</p>') + '</div>';

  const leg = '<ul class="sf-leg sf-cal-leg" style="margin:0 0 12px">' +
    [['nao_iniciada', 'Não iniciada'], ['em_execucao', 'Em execução'], ['aguardando', 'Aguardando terceiros'],
     ['atrasada', 'Atrasada']].map(x => '<li><i class="c-' + x[0] + '"></i>' + x[1] + '</li>').join('') + '</ul>';
  const semPrazo = base.length - comPrazo.length;
  return nav + aviso + leg + grade + agenda +
    (semPrazo ? '<p class="sf-nota-cal">' + contaTexto(semPrazo, 'ação em aberto sem prazo pactuado não aparece',
      'ações em aberto sem prazo pactuado não aparecem') + ' no calendário. Elas estão listadas ao final da Lista.</p>' : '');
}

function entregasResultado(){
  const base = entregasFiltradas();
  return state.sf.vis === 'calendario' ? calendarioEntregas(base) : listaEntregas(base);
}

function paginaEntregas(){
  const c = state.consol, f = state.sf;
  const op = (v, l, atual) => '<option value="' + v + '"' + (v === atual ? ' selected' : '') + '>' + l + '</option>';
  const sel = (nome, rot, ops) =>
    '<label class="campo"><span>' + rot + '</span><select data-sff="' + nome + '">' + ops + '</select></label>';
  if(f.org && !c.estudos.some(s => chaveEstudo(s) === f.org)) f.org = '';
  const filtros = '<div class="card sf-filtros">' +
    sel('org', 'Órgão e estudo', op('', 'Todos os estudos', f.org) +
      c.estudos.map(s => op(esc(chaveEstudo(s)), esc(s.sigla) + ' · ' + esc(s.nome), f.org)).join('')) +
    sel('sit', 'Situação', op('', 'Todas em aberto', f.sit) +
      ['nao_iniciada', 'em_execucao', 'aguardando'].map(k => op(k, STATUS_ACAO[k].rotulo, f.sit)).join('')) +
    (f.vis === 'calendario' ? '' : sel('per', 'Período', op('', 'Todos os prazos', f.per) +
      op('atrasadas', 'Só as atrasadas', f.per) + op('7', 'Até 7 dias', f.per) +
      op('30', 'Até 30 dias', f.per) + op('90', 'Até 90 dias', f.per))) +
    '<label class="campo busca"><span>Buscar</span><input type="search" data-sff="q" value="' + esc(f.q) +
      '" placeholder="Ação, código, responsável ou estudo"></label>' +
  '</div>';
  return '<div class="sf">' +
    '<h1 class="page-hello">Próximas entregas</h1>' +
    '<p class="page-date">Ações em aberto de todos os estudos, pela data do prazo pactuado</p>' +
    '<div class="pl-bar" style="margin:22px 0 14px"><div class="pl-views" style="margin-left:0">' +
      '<button data-sfvis="lista"' + (f.vis !== 'calendario' ? ' class="active"' : '') + '>Lista</button>' +
      '<button data-sfvis="calendario"' + (f.vis === 'calendario' ? ' class="active"' : '') + '>Calendário</button>' +
    '</div></div>' +
    filtros +
    '<div id="sf-res">' + entregasResultado() + '</div>' +
  '</div>';
}

/* ================================================================ janelas de consulta */
function localizaAcao(chave){
  const p = String(chave || '').split('|');
  const s = estudoPorChave(p[0] + '|' + p[1]);
  if(!s) return null;
  const recs = s.recomendacoes.concat(s.recsArquivadas || []);
  for(let i = 0; i < recs.length; i++){
    const r = recs[i];
    const x = r.acoes.filter(y => String(y.acao.codigo) === p[2])[0];
    if(x) return { s:s, r:r, x:x };
  }
  return null;
}

/* Ficha completa em leitura, com as mesmas secoes do cartao da secretaria,
   mais o historico. Nao ha botao de edicao: quem edita e a secretaria.   */
function janelaSefaFicha(chave){
  const l = localizaAcao(chave);
  if(!l) return '';
  const a = l.x.acao, e = l.x.estado, v = c => valorCampo(a, e, c);
  const k = acaoStatus(a, e), st = STATUS_ACAO[k];
  const evs = evidenciasDe(e), hs = historicoDe(e);
  const selos = selosCiclo(a) +
    seloNova(a) +
    '<span class="badge b-' + k + '">' + svg(st.icone) + st.rotulo + '</span>' +
    (acaoAtrasada(a, e) ? '<span class="badge b-atraso">' + svg('alerta') + 'Atrasada</span>' : '') +
    (k === 'concluida' && !evs.length ? '<span class="badge b-atraso">' + svg('alerta') + 'Sem evidência</span>' : '');
  return '<div class="mo-caixa" role="dialog" aria-modal="true" aria-label="Ficha da ação">' +
    '<header class="mo-topo">' +
      '<div class="tit">' + chipCod(l.x.cod, ' style="--rec:' + l.r.cor + '"') +
        '<span class="mo-eyebrow">' + esc(l.s.sigla) + ' · ' + esc(l.s.nome) + ' · ' +
          esc(l.s.rotuloBloco) + (l.r.exib ? ' ' + l.r.exib : '') + '</span>' +
        '<b>' + ouDefinir(esc(v('titulo'))) + '</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    '<div class="mo-corpo sf-ficha" style="--rec:' + l.r.cor + '">' +
      '<div class="acao-top">' + selos + '</div>' +
      '<p class="desc">' + ouDefinir(esc(v('descricao'))) + '</p>' +
      secaoAcao('Responsabilidade', fichaCampos([
        ['Responsável (unidade ou órgão)', esc(v('responsavel'))],
        ['Área responsável', esc(v('area'))],
        ['Pessoa responsável', esc(v('pessoa'))]
      ])) +
      secaoAcao('Escopo e entrega', fichaCampos([
        ['Produto esperado', esc(v('produto'))],
        ['Resultado esperado', esc(v('resultado'))]
      ], 2)) +
      secaoAcao('Acompanhamento',
        fichaCampos([['Situação', st.rotulo], ['Prazo pactuado', dataBR(prazoDe(l.x))]], 2) +
        barraProgresso(a, e) + caixaJustificativa(a, e)) +
      secaoAcao('Evidências', listaEvidencias(evs, true), evs.length) +
      secaoAcao('Histórico de atualizações', hs.length
        ? hs.slice().reverse().map((h, n) => cartaoHistorico(h, hs.length - n)).join('')
        : '<p class="hi-sem">Nenhuma atualização registrada nesta ação até agora.</p>', hs.length) +
    '</div>' +
    '<footer class="mo-rodape">' +
      '<span class="sf-so-leitura">' + svg('info') + 'Consulta. A ficha se edita em Configurações, na aba Ações; ' +
        'o acompanhamento é atualizado pela secretaria. Evidência indevida pode ser removida, com registro no histórico.</span>' +
      '<button class="btn-primario" data-fechar="1">Fechar</button>' +
    '</footer>' +
  '</div>';
}

/* Historico do estudo inteiro, com escolha da acao. */
function janelaSefaHist(chave){
  const s = estudoPorChave(chave);
  if(!s) return '';
  const itens = [];
  /* As acoes arquivadas entram no historico do estudo, marcadas. */
  s.recomendacoes.concat(s.recsArquivadas || []).forEach(r => r.acoes.concat(r.arquivadas || []).forEach(x =>
    itens.push({ codigo:x.acao.codigo, rotulo:x.cod || '',
                 titulo:((r.arquivadas || []).indexOf(x) >= 0 ? 'Arquivada: ' : '') + tituloDe(x),
                 hist:historicoDe(x.estado) })));
  const total = itens.reduce((n, it) => n + it.hist.length, 0);
  return '<div class="mo-caixa mo-larga" role="dialog" aria-modal="true" aria-label="Histórico do estudo">' +
    '<header class="mo-topo">' +
      '<div class="tit"><span class="mo-eyebrow">Histórico de atualizações · ' + esc(s.sigla) + '</span>' +
        '<b>' + esc(s.nome) + ' · ' + contaTexto(total, 'atualização registrada', 'atualizações registradas') + '</b></div>' +
      '<button class="mo-fechar" data-fechar="1" aria-label="Fechar">' + svg('fechar') + '</button>' +
    '</header>' +
    corpoHistorico(itens) +
    '<footer class="mo-rodape"><button class="btn-primario" data-fechar="1">Fechar</button></footer>' +
  '</div>';
}
const JANELAS_SEFA = { sefaFicha:janelaSefaFicha, sefaHist:janelaSefaHist };

/* ================================================================ eventos */
function ligaSefa(item){
  const pg = $('#page');
  if(!ehCoordenacao() || !pg.querySelector('.sf')) return;
  pg.querySelectorAll('[data-estudo]').forEach(b =>
    b.addEventListener('click', () => {
      state.sf.estudo = b.dataset.estudo || null;
      if(state.pagina === 'estudos'){ desenhaPagina(item); window.scrollTo(0, 0); }
      else navega('estudos');
    }));
  pg.querySelectorAll('[data-histestudo]').forEach(b =>
    b.addEventListener('click', () => abreModal('sefaHist', b.dataset.histestudo)));
  pg.querySelectorAll('[data-sfvis]').forEach(b =>
    b.addEventListener('click', () => { state.sf.vis = b.dataset.sfvis; desenhaPagina(item); }));
  pg.querySelectorAll('[data-sfarq]').forEach(b =>
    b.addEventListener('click', () => { state.sf.arq = b.dataset.sfarq === '1'; desenhaPagina(item); }));
  /* Filtro redesenha so o resultado, para a busca nao perder o foco. */
  pg.querySelectorAll('[data-sff]').forEach(el =>
    el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => {
      state.sf[el.dataset.sff] = el.value;
      redesenhaResultado();
    }));
  ligaResultado(pg);
}
function redesenhaResultado(){
  const res = $('#sf-res');
  if(!res) return;
  res.innerHTML = entregasResultado();
  ligaResultado(res);
}
function ligaResultado(raiz){
  raiz.querySelectorAll('[data-ficha]').forEach(b =>
    b.addEventListener('click', ev => { ev.stopPropagation(); abreModal('sefaFicha', b.dataset.ficha); }));
  raiz.querySelectorAll('[data-sfmes]').forEach(b =>
    b.addEventListener('click', () => { state.sf.mes = b.dataset.sfmes; redesenhaResultado(); }));
}

/* ============================================================
   6. INICIALIZACAO
   ============================================================ */
$('#btn-logout').addEventListener('click', sair);
$('#sel-orgao').addEventListener('change', ev => trocaOrgao(ev.target.value));
$('#btn-burger').addEventListener('click', () => document.body.classList.toggle('nav-open'));
$('#scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
document.querySelectorAll('.tb-texto [data-texto]').forEach(b =>
  b.addEventListener('click', () => escolheTexto(b.dataset.texto)));
$('#btn-texto-ciclo').addEventListener('click', () =>
  escolheTexto(TEXTOS[(TEXTOS.indexOf(textoAtual()) + 1) % TEXTOS.length]));
window.addEventListener('hashchange', () => { if(state.perfil) navega(location.hash.replace('#','')); });

/* A janela fecha pelo fundo e pelo Esc, como qualquer caixa de dialogo.
   O que estava sendo digitado e descartado: so o botao Salvar edicao grava. */
$('#modal').addEventListener('click', ev => {
  if(ev.target === $('#modal')){ fechaModal(); redesenha(); }
});
document.addEventListener('keydown', ev => {
  if(ev.key === 'Escape' && state.modal){ fechaModal(); redesenha(); }
});

/* Anexo de evidencia: o clique baixa o arquivo, em qualquer tela ou janela. */
document.addEventListener('click', ev => {
  const a = ev.target.closest && ev.target.closest('[data-anexo]');
  if(a){ ev.preventDefault(); ev.stopPropagation(); abreAnexo(a); }
}, true);

/* Retomada da sessao ao recarregar a pagina: vale se o Supabase ainda tem a
   sessao desta aba e o servidor confirma o acesso ao orgao que estava aberto. */
(async function inicia(){
  let salvo = null;
  try{ salvo = sessionStorage.getItem(PRE + 'perfil'); }catch(e){}
  try{
    if(salvo && await srv.sessaoAtiva()){
      const r = await srv.verificarAcesso(salvo);
      if(r && r.ok){ state.usuario = r.usuario; await entrar(salvo); return; }
      await srv.sair();
    }
  }catch(e){ console.error(e); }
  renderLogin();
})();

