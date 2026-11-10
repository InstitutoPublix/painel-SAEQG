// SAEQG · Edge Function "usuarios"
// Cadastro de acesso (Configurações > Cadastros). Só o gestor da SEFA usa.
// Fica numa função, e não em RPC, porque criar, trocar senha e excluir conta
// mexe em auth.users e exige a service role, que nunca vai ao navegador.
//
// POST /functions/v1/usuarios  (Authorization: Bearer <token do gestor>)
//   { "acao": "salvar",  "id"?: uuid, "email", "senha"?, "nivel": "gestor"|"restrito",
//     "acessos"?: { "<org>": ["<estudo>", ...] } }            -> { ok, id }
//   { "acao": "excluir", "id": uuid }                          -> { ok }
//
// POST /functions/v1/usuarios  (header x-bootstrap-token: <SAEQG_BOOTSTRAP_TOKEN>)
//   { "acao": "bootstrap", "email", "senha" }                  -> { ok, id }
//   Cria o primeiro gestor. Só funciona enquanto não houver nenhum gestor.
//
// Erros de regra voltam com status 200 e { ok:false, erro } para a janela
// mostrar a mensagem; falta de permissão volta 401/403.
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-bootstrap-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const resposta = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const falha = (erro: string, status = 200) => resposta({ ok: false, erro }, status);

const normEmail = (v: unknown) => String(v ?? "").trim().toLowerCase();
const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Mesma regra da tela: 6 caracteres, uma maiúscula e um caractere especial.
function faltaNaSenha(s: string): string {
  const falta: string[] = [];
  if (s.length < 6) falta.push("ao menos 6 caracteres");
  if (!/\p{Lu}/u.test(s)) falta.push("uma letra maiúscula");
  if (!/[^\p{L}\p{N}\s]/u.test(s)) falta.push("um caractere especial (como ! @ # $ % *)");
  return falta.length ? "A senha precisa ter " + falta.join(", ").replace(/, ([^,]*)$/, " e $1") + "." : "";
}

type Acessos = Record<string, string[]>;
interface Pedido {
  acao?: string;
  id?: string;
  email?: string;
  senha?: string;
  nivel?: string;
  acessos?: Acessos;
}

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function gravaAcessos(id: string, nivel: string, acessos: Acessos) {
  const { error: e1 } = await admin.from("usuario_acessos").delete().eq("usuario_id", id);
  if (e1) throw e1;
  if (nivel !== "restrito") return;
  const linhas = Object.entries(acessos).flatMap(([org, ests]) =>
    ests.map((estudo_id) => ({ usuario_id: id, org_id: org, estudo_id })));
  if (!linhas.length) return;
  const { error: e2 } = await admin.from("usuario_acessos").insert(linhas);
  if (e2) throw e2;
}

// Confere secretarias e estudos marcados para o usuário restrito.
async function validaAcessos(acessos: unknown): Promise<Acessos | string> {
  if (!acessos || typeof acessos !== "object") return "Marque ao menos uma secretaria para o usuário restrito.";
  const limpo: Acessos = {};
  for (const [org, ests] of Object.entries(acessos as Record<string, unknown>)) {
    const lista = Array.isArray(ests) ? [...new Set(ests.map(String))] : [];
    if (!lista.length) {
      const { data } = await admin.from("orgaos").select("sigla").eq("id", org).maybeSingle();
      return "Marque ao menos um estudo da " + (data?.sigla ?? org) + " ou desmarque a secretaria.";
    }
    const { data, error } = await admin.from("estudos").select("id").eq("org_id", org).in("id", lista);
    if (error) throw error;
    if ((data ?? []).length !== lista.length) return "Estudo inexistente na secretaria " + org + ".";
    limpo[org] = lista;
  }
  if (!Object.keys(limpo).length) return "Marque ao menos uma secretaria para o usuário restrito.";
  return limpo;
}

async function contaGestores(excetoId?: string) {
  let q = admin.from("usuarios").select("id", { count: "exact", head: true }).eq("nivel", "gestor");
  if (excetoId) q = q.neq("id", excetoId);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}

async function criaConta(email: string, senha: string, nivel: string, acessos: Acessos) {
  const { data, error } = await admin.auth.admin.createUser({ email, password: senha, email_confirm: true });
  if (error || !data.user) {
    const msg = /already|registered|exists/i.test(error?.message ?? "")
      ? "Já existe um usuário com este e-mail."
      : "Não foi possível criar o acesso: " + (error?.message ?? "erro desconhecido");
    return falha(msg);
  }
  const id = data.user.id;
  try {
    const { error: e } = await admin.from("usuarios").insert({ id, email, nivel });
    if (e) throw e;
    await gravaAcessos(id, nivel, acessos);
  } catch (e) {
    await admin.auth.admin.deleteUser(id);
    throw e;
  }
  return resposta({ ok: true, id });
}

async function salvar(p: Pedido, eu: string) {
  const id = p.id || null;
  const email = normEmail(p.email);
  const senha = String(p.senha ?? "");
  const nivel = String(p.nivel ?? "");

  const { data: antigo } = id
    ? await admin.from("usuarios").select("*").eq("id", id).maybeSingle()
    : { data: null };
  if (id && !antigo) return falha("Usuário não encontrado.");

  if (!emailValido(email)) return falha("Informe um e-mail válido para o login.");
  const { data: mesmo } = await admin.from("usuarios").select("id").eq("email", email).maybeSingle();
  if (mesmo && mesmo.id !== id) return falha("Já existe um usuário com este e-mail.");
  if (!antigo || senha) {
    const falta = faltaNaSenha(senha);
    if (falta) return falha(antigo ? falta.replace("A senha", "A nova senha") : falta);
  }
  if (nivel !== "gestor" && nivel !== "restrito") return falha("Escolha o nível de acesso.");
  if (nivel !== "gestor" && (await contaGestores(id ?? undefined)) === 0) {
    return falha(antigo
      ? "Este é o único gestor cadastrado: ele precisa continuar gestor."
      : "O primeiro cadastro precisa ser de um usuário gestor, para a SEFA manter o acesso à coordenação.");
  }
  if (antigo && antigo.id === eu && nivel !== antigo.nivel) {
    return falha("Você não pode mudar o seu próprio nível de acesso.");
  }
  let acessos: Acessos = {};
  if (nivel === "restrito") {
    const v = await validaAcessos(p.acessos);
    if (typeof v === "string") return falha(v);
    acessos = v;
  }

  if (!antigo) return await criaConta(email, senha, nivel, acessos);

  const mudaAuth: { email?: string; password?: string; email_confirm?: boolean } = {};
  if (email !== antigo.email) Object.assign(mudaAuth, { email, email_confirm: true });
  if (senha) mudaAuth.password = senha;
  if (Object.keys(mudaAuth).length) {
    const { error } = await admin.auth.admin.updateUserById(antigo.id, mudaAuth);
    if (error) return falha("Não foi possível atualizar o acesso: " + error.message);
  }
  const { error } = await admin.from("usuarios").update({ email, nivel }).eq("id", antigo.id);
  if (error) throw error;
  await gravaAcessos(antigo.id, nivel, acessos);
  return resposta({ ok: true, id: antigo.id });
}

async function excluir(p: Pedido, eu: string) {
  const { data: u } = await admin.from("usuarios").select("*").eq("id", p.id ?? "").maybeSingle();
  if (!u) return falha("Usuário não encontrado.");
  if (u.id === eu) return falha("Você não pode excluir o seu próprio acesso.");
  if (u.nivel === "gestor" && (await contaGestores(u.id)) === 0) {
    return falha("Este é o único gestor cadastrado. Cadastre outro gestor antes de excluí-lo.");
  }
  // apaga a conta; o perfil e os acessos saem em cascata, o histórico fica
  const { error } = await admin.auth.admin.deleteUser(u.id);
  if (error) return falha("Não foi possível excluir: " + error.message);
  return resposta({ ok: true });
}

async function bootstrap(req: Request, p: Pedido) {
  const token = Deno.env.get("SAEQG_BOOTSTRAP_TOKEN") ?? "";
  if (!token || req.headers.get("x-bootstrap-token") !== token) return falha("Token de bootstrap inválido.", 403);
  if ((await contaGestores()) > 0) return falha("Já existe gestor cadastrado: use Configurações > Cadastros.", 409);
  const email = normEmail(p.email), senha = String(p.senha ?? "");
  if (!emailValido(email)) return falha("Informe um e-mail válido.");
  const falta = faltaNaSenha(senha);
  if (falta) return falha(falta);
  return await criaConta(email, senha, "gestor", {});
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return falha("Método não permitido.", 405);

  let p: Pedido;
  try {
    p = await req.json();
  } catch {
    return falha("Corpo da requisição inválido.", 400);
  }

  try {
    if (p.acao === "bootstrap") return await bootstrap(req, p);

    // quem chama precisa ser gestor
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: quem } = jwt ? await admin.auth.getUser(jwt) : { data: { user: null } };
    if (!quem?.user) return falha("Sessão expirada. Entre novamente.", 401);
    const { data: perfil } = await admin.from("usuarios").select("nivel").eq("id", quem.user.id).maybeSingle();
    if (perfil?.nivel !== "gestor") return falha("Acesso restrito à coordenação (SEFA).", 403);

    if (p.acao === "salvar") return await salvar(p, quem.user.id);
    if (p.acao === "excluir") return await excluir(p, quem.user.id);
    return falha("Ação desconhecida.", 400);
  } catch (e) {
    console.error(e);
    return falha("Erro interno ao gravar o cadastro.", 500);
  }
});
