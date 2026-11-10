-- =============================================================================
-- SAEQG · Sistema de Acompanhamento dos Estudos da Qualidade do Gasto
-- Schema, segurança (RLS) e funções de escrita.
--
-- Modelo:
--   orgaos ─< estudos ─< recomendacoes ─< acoes ─< evidencias ─< anexos
--                                              └─< historico
--   usuarios (perfil de auth.users) ─< usuario_acessos >─ estudos
--
-- Leitura: tabelas com RLS, consultadas direto pelo cliente.
-- Escrita: só por funções (RPC) security definer, que conferem o papel de quem
-- chama. Nenhuma tabela aceita insert/update/delete direto do cliente.
-- Usuários: criados e alterados pela Edge Function "usuarios" (precisa da
-- service role para mexer em auth.users).
-- =============================================================================

-- ---------------------------------------------------------------- tabelas

create table public.orgaos (
  id            text primary key check (id ~ '^[a-z0-9_-]+$'),
  sigla         text not null check (btrim(sigla) <> ''),
  nome          text not null default '',
  orgao         text not null check (btrim(orgao) <> ''),
  tipo          text not null default 'orgao' check (tipo in ('orgao', 'sefa')),
  do_relatorio  boolean not null default false,
  ordem         integer not null default 0,
  apagado       boolean not null default false,
  apagado_em    timestamptz,
  criado_em     timestamptz not null default now()
);
comment on table public.orgaos is 'Secretarias participantes e a coordenação (SEFA).';

create table public.estudos (
  org_id        text not null references public.orgaos (id) on delete cascade,
  id            text not null check (id ~ '^[a-z0-9_-]+$'),
  nome          text not null check (btrim(nome) <> ''),
  programa      text not null default '',
  acao          text not null default '',
  resumo        jsonb not null default '[]'::jsonb check (jsonb_typeof(resumo) = 'array'),
  rotulo_bloco  text,
  rotulo_plural text,
  focal_area    text not null default '',
  focal_pessoa  text not null default '',
  focal_email   text not null default '',
  do_relatorio  boolean not null default false,
  ordem         integer not null default 0,
  oculto        boolean not null default false,
  arquivado     boolean not null default false,
  arquivado_em  timestamptz,
  apagado       boolean not null default false,
  apagado_em    timestamptz,
  criado_em     timestamptz not null default now(),
  primary key (org_id, id)
);
comment on table public.estudos is 'Estudos da Qualidade do Gasto (no front: "pilotos"). oculto = fora do ar para a secretaria.';

create table public.recomendacoes (
  org_id        text not null,
  estudo_id     text not null,
  rid           text not null check (rid ~ '^[a-z0-9_-]+$'),
  numero        integer not null check (numero > 0),
  titulo        text not null check (btrim(titulo) <> ''),
  chamada       text not null default '',
  icone         text not null default 'lista',
  cor           text,
  fonte         text,
  quadro        text,
  paragrafos    jsonb not null default '[]'::jsonb check (jsonb_typeof(paragrafos) = 'array'),
  do_relatorio  boolean not null default false,
  arquivado     boolean not null default false,
  arquivado_em  timestamptz,
  apagado       boolean not null default false,
  apagado_em    timestamptz,
  criado_em     timestamptz not null default now(),
  primary key (org_id, estudo_id, rid),
  unique (org_id, estudo_id, numero),
  foreign key (org_id, estudo_id) references public.estudos (org_id, id) on delete cascade
);

create table public.acoes (
  org_id             text not null,
  estudo_id          text not null,
  codigo             text not null check (codigo ~ '^[0-9]+\.[0-9]+$'),
  rid                text not null,
  ordem              integer not null default 0,
  -- ficha (texto vigente; a do relatório entra pela carga inicial)
  titulo             text not null default '',
  descricao          text not null default '',
  responsavel        text not null default '',
  area               text not null default '',
  pessoa             text not null default '',
  produto            text not null default '',
  resultado          text not null default '',
  horizonte          text,
  horizonte_original text,
  natureza           text,
  ciclo              integer,
  origem             text not null default 'relatorio'
                     check (origem in ('relatorio', 'orgao', 'coordenacao')),
  -- acompanhamento (secretaria) e prazo pactuado (coordenação)
  status             text not null default 'nao_iniciada'
                     check (status in ('nao_iniciada', 'em_execucao', 'aguardando', 'concluida')),
  prazo              date,
  progresso          integer check (progresso between 0 and 100),
  justificativa      text,
  -- ciclo de vida
  arquivado          boolean not null default false,
  arquivado_em       timestamptz,
  apagado            boolean not null default false,
  apagado_em         timestamptz,
  criado_em          timestamptz not null default now(),
  atualizado_em      timestamptz not null default now(),
  primary key (org_id, estudo_id, codigo),
  foreign key (org_id, estudo_id, rid)
    references public.recomendacoes (org_id, estudo_id, rid) on delete cascade
);
create index acoes_rec_idx on public.acoes (org_id, estudo_id, rid);

create table public.evidencias (
  id          uuid primary key default gen_random_uuid(),
  org_id      text not null,
  estudo_id   text not null,
  codigo      text not null,
  data        date not null default current_date,
  texto       text not null check (btrim(texto) <> ''),
  criado_por  uuid references auth.users (id) on delete set null,
  criado_em   timestamptz not null default now(),
  foreign key (org_id, estudo_id, codigo)
    references public.acoes (org_id, estudo_id, codigo) on delete cascade
);
create index evidencias_acao_idx on public.evidencias (org_id, estudo_id, codigo);

create table public.anexos (
  id            uuid primary key default gen_random_uuid(),
  evidencia_id  uuid not null references public.evidencias (id) on delete cascade,
  nome          text not null,
  tamanho       bigint not null default 0,
  tipo          text not null default '',
  caminho       text not null unique,   -- objeto no bucket "evidencias"
  criado_em     timestamptz not null default now()
);
create index anexos_evidencia_idx on public.anexos (evidencia_id);

create table public.historico (
  id          uuid primary key default gen_random_uuid(),
  org_id      text not null,
  estudo_id   text not null,
  codigo      text not null,
  em          timestamptz not null default now(),
  tipo        text not null default 'edicao' check (tipo in ('edicao', 'rapida', 'coordenacao')),
  autor       text not null default '',
  email       text not null default '',
  campos      jsonb,                                  -- a janela como foi salva
  mudancas    jsonb not null default '[]'::jsonb,     -- [{campo, rotulo, de, para}]
  usuario_id  uuid references auth.users (id) on delete set null,
  foreign key (org_id, estudo_id, codigo)
    references public.acoes (org_id, estudo_id, codigo) on delete cascade
);
create index historico_acao_idx on public.historico (org_id, estudo_id, codigo, em);

create table public.usuarios (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  nivel      text not null check (nivel in ('gestor', 'restrito')),
  criado_em  timestamptz not null default now()
);
comment on table public.usuarios is 'Cadastros de acesso. gestor = coordenação (SEFA); restrito = só os estudos de usuario_acessos.';

create table public.usuario_acessos (
  usuario_id  uuid not null references public.usuarios (id) on delete cascade,
  org_id      text not null,
  estudo_id   text not null,
  primary key (usuario_id, org_id, estudo_id),
  foreign key (org_id, estudo_id) references public.estudos (org_id, id) on delete cascade
);

-- ---------------------------------------------------------------- papéis

create or replace function public.eh_gestor()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.usuarios u where u.id = auth.uid() and u.nivel = 'gestor');
$$;

-- Estudo visível para quem chama. Gestor vê tudo; restrito vê os estudos
-- liberados no cadastro, desde que estejam no ar e não apagados.
create or replace function public.pode_ver_estudo(p_org text, p_estudo text)
returns boolean language sql stable security definer set search_path = '' as $$
  select public.eh_gestor() or exists (
    select 1
      from public.usuario_acessos ua
      join public.estudos e on e.org_id = ua.org_id and e.id = ua.estudo_id
      join public.orgaos  o on o.id = e.org_id
     where ua.usuario_id = auth.uid()
       and ua.org_id = p_org and ua.estudo_id = p_estudo
       and not e.apagado and not e.oculto and not o.apagado);
$$;

-- Estudo em que quem chama pode registrar acompanhamento: restrito com acesso,
-- estudo no ar e não arquivado.
create or replace function public.pode_atualizar_estudo(p_org text, p_estudo text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
      from public.usuarios u
      join public.usuario_acessos ua on ua.usuario_id = u.id
      join public.estudos e on e.org_id = ua.org_id and e.id = ua.estudo_id
      join public.orgaos  o on o.id = e.org_id
     where u.id = auth.uid() and u.nivel = 'restrito'
       and ua.org_id = p_org and ua.estudo_id = p_estudo
       and not e.apagado and not e.oculto and not e.arquivado and not o.apagado);
$$;

create or replace function public.exige_gestor()
returns void language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.eh_gestor() then
    raise exception 'Acesso restrito à coordenação (SEFA).' using errcode = '42501';
  end if;
end $$;

-- Identificador curto para itens cadastrados no sistema (org…, pil…, rec…).
create or replace function public.id_novo(p_prefixo text)
returns text language sql volatile set search_path = '' as $$
  select p_prefixo || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
$$;

-- ---------------------------------------------------------------- RLS

alter table public.orgaos          enable row level security;
alter table public.estudos         enable row level security;
alter table public.recomendacoes   enable row level security;
alter table public.acoes           enable row level security;
alter table public.evidencias      enable row level security;
alter table public.anexos          enable row level security;
alter table public.historico       enable row level security;
alter table public.usuarios        enable row level security;
alter table public.usuario_acessos enable row level security;

-- Escrita só pelas funções abaixo.
revoke insert, update, delete, truncate on all tables in schema public from anon, authenticated;
revoke all on all tables in schema public from anon;

create policy orgaos_leitura on public.orgaos for select to authenticated
  using (public.eh_gestor() or exists (
    select 1 from public.usuario_acessos ua
     where ua.usuario_id = auth.uid() and ua.org_id = orgaos.id and not orgaos.apagado));

create policy estudos_leitura on public.estudos for select to authenticated
  using (public.pode_ver_estudo(org_id, id));

create policy recomendacoes_leitura on public.recomendacoes for select to authenticated
  using (public.pode_ver_estudo(org_id, estudo_id) and (public.eh_gestor() or not apagado));

create policy acoes_leitura on public.acoes for select to authenticated
  using (public.pode_ver_estudo(org_id, estudo_id) and (public.eh_gestor() or not apagado));

create policy evidencias_leitura on public.evidencias for select to authenticated
  using (public.pode_ver_estudo(org_id, estudo_id));

create policy anexos_leitura on public.anexos for select to authenticated
  using (exists (select 1 from public.evidencias ev
                  where ev.id = anexos.evidencia_id
                    and public.pode_ver_estudo(ev.org_id, ev.estudo_id)));

create policy historico_leitura on public.historico for select to authenticated
  using (public.pode_ver_estudo(org_id, estudo_id));

create policy usuarios_leitura on public.usuarios for select to authenticated
  using (id = auth.uid() or public.eh_gestor());

create policy usuario_acessos_leitura on public.usuario_acessos for select to authenticated
  using (usuario_id = auth.uid() or public.eh_gestor());

-- ---------------------------------------------------------------- acesso

-- Tela de acesso (antes do login): órgãos em uso e se há estudo no ar.
create or replace function public.orgaos_publicos()
returns table (id text, sigla text, nome text, orgao text, tipo text, no_ar boolean)
language sql stable security definer set search_path = '' as $$
  select o.id, o.sigla, o.nome, o.orgao, o.tipo,
         o.tipo = 'sefa' or exists (select 1 from public.estudos e
                                     where e.org_id = o.id and not e.apagado and not e.oculto)
    from public.orgaos o
   where not o.apagado
   order by o.ordem, o.criado_em;
$$;

-- Confere, depois do login no Supabase Auth, se o usuário pode entrar pelo
-- órgão escolhido. Mesmas regras e mensagens da versão local do front.
create or replace function public.verificar_acesso(p_orgao text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  u public.usuarios;
  o public.orgaos;
begin
  select * into u from public.usuarios where id = auth.uid();
  if u.id is null then
    return jsonb_build_object('ok', false, 'erro', 'Login ou senha inválidos.');
  end if;
  select * into o from public.orgaos where id = p_orgao and not apagado;
  if o.id is null then
    return jsonb_build_object('ok', false, 'erro', 'Órgão não encontrado.');
  end if;
  if o.tipo = 'sefa' and u.nivel <> 'gestor' then
    return jsonb_build_object('ok', false, 'erro', 'Este usuário não tem acesso à coordenação.');
  end if;
  if o.tipo <> 'sefa' and u.nivel = 'gestor' then
    return jsonb_build_object('ok', false, 'erro', 'Usuário gestor entra pela coordenação (SEFA).');
  end if;
  if o.tipo <> 'sefa' and not exists (select 1 from public.usuario_acessos
                                       where usuario_id = u.id and org_id = o.id) then
    return jsonb_build_object('ok', false, 'erro', 'Este usuário não tem acesso a este órgão.');
  end if;
  return jsonb_build_object('ok', true, 'perfil', o.id,
                            'usuario', jsonb_build_object('email', u.email, 'nivel', u.nivel));
end $$;

-- ---------------------------------------------------------------- cadastro (coordenação)

create or replace function public.salvar_orgao(p_id text, p_sigla text, p_nome text, p_orgao text)
returns text language plpgsql security definer set search_path = '' as $$
declare v_id text := nullif(btrim(coalesce(p_id, '')), '');
begin
  perform public.exige_gestor();
  if btrim(coalesce(p_sigla, '')) = '' or btrim(coalesce(p_orgao, '')) = '' then
    raise exception 'Informe a sigla e o nome completo.' using errcode = '22023';
  end if;
  if v_id is null then
    v_id := public.id_novo('org');
    insert into public.orgaos (id, sigla, nome, orgao, tipo, ordem)
    values (v_id, btrim(p_sigla), btrim(coalesce(p_nome, '')), btrim(p_orgao), 'orgao',
            coalesce((select max(ordem) from public.orgaos), 0) + 1);
  else
    update public.orgaos
       set sigla = btrim(p_sigla), nome = btrim(coalesce(p_nome, '')), orgao = btrim(p_orgao)
     where id = v_id;
    if not found then raise exception 'Secretaria não encontrada.' using errcode = 'P0002'; end if;
  end if;
  return v_id;
end $$;

create or replace function public.salvar_estudo(
  p_org text, p_id text, p_nome text, p_programa text, p_acao text, p_resumo jsonb,
  p_focal_area text, p_focal_pessoa text, p_focal_email text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_id text := nullif(btrim(coalesce(p_id, '')), '');
  v_email text := btrim(coalesce(p_focal_email, ''));
  v_resumo jsonb := coalesce(p_resumo, '[]'::jsonb);
begin
  perform public.exige_gestor();
  if btrim(coalesce(p_nome, '')) = '' then
    raise exception 'Informe o nome do estudo.' using errcode = '22023';
  end if;
  if v_email <> '' and v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'Informe um e-mail válido ou deixe o campo em branco.' using errcode = '22023';
  end if;
  if jsonb_typeof(v_resumo) <> 'array' then
    raise exception 'Resumo inválido.' using errcode = '22023';
  end if;
  if not exists (select 1 from public.orgaos where id = p_org and tipo = 'orgao') then
    raise exception 'Secretaria não encontrada.' using errcode = 'P0002';
  end if;
  if v_id is null then
    v_id := public.id_novo('pil');
    insert into public.estudos (org_id, id, nome, programa, acao, resumo,
                                focal_area, focal_pessoa, focal_email, ordem)
    values (p_org, v_id, btrim(p_nome), btrim(coalesce(p_programa, '')), btrim(coalesce(p_acao, '')),
            v_resumo, btrim(coalesce(p_focal_area, '')), btrim(coalesce(p_focal_pessoa, '')), v_email,
            coalesce((select max(ordem) from public.estudos where org_id = p_org), 0) + 1);
  else
    update public.estudos
       set nome = btrim(p_nome), programa = btrim(coalesce(p_programa, '')),
           acao = btrim(coalesce(p_acao, '')), resumo = v_resumo,
           focal_area = btrim(coalesce(p_focal_area, '')),
           focal_pessoa = btrim(coalesce(p_focal_pessoa, '')), focal_email = v_email
     where org_id = p_org and id = v_id;
    if not found then raise exception 'Estudo não encontrado.' using errcode = 'P0002'; end if;
  end if;
  return v_id;
end $$;

create or replace function public.salvar_recomendacao(
  p_org text, p_estudo text, p_rid text, p_titulo text, p_chamada text, p_icone text,
  p_paragrafos jsonb)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_rid text := nullif(btrim(coalesce(p_rid, '')), '');
  v_par jsonb := coalesce(p_paragrafos, '[]'::jsonb);
begin
  perform public.exige_gestor();
  if btrim(coalesce(p_titulo, '')) = '' then
    raise exception 'Informe o título da recomendação.' using errcode = '22023';
  end if;
  if jsonb_typeof(v_par) <> 'array' then
    raise exception 'Parágrafos inválidos.' using errcode = '22023';
  end if;
  -- trava o estudo para a numeração não repetir em cadastros simultâneos
  perform 1 from public.estudos where org_id = p_org and id = p_estudo for update;
  if not found then raise exception 'Estudo não encontrado.' using errcode = 'P0002'; end if;
  if v_rid is null then
    v_rid := public.id_novo('rec');
    insert into public.recomendacoes (org_id, estudo_id, rid, numero, titulo, chamada, icone, paragrafos)
    values (p_org, p_estudo, v_rid,
            coalesce((select max(numero) from public.recomendacoes
                       where org_id = p_org and estudo_id = p_estudo), 0) + 1,
            btrim(p_titulo), btrim(coalesce(p_chamada, '')),
            coalesce(nullif(btrim(coalesce(p_icone, '')), ''), 'lista'), v_par);
  else
    update public.recomendacoes
       set titulo = btrim(p_titulo), chamada = btrim(coalesce(p_chamada, '')),
           icone = coalesce(nullif(btrim(coalesce(p_icone, '')), ''), 'lista'), paragrafos = v_par
     where org_id = p_org and estudo_id = p_estudo and rid = v_rid;
    if not found then raise exception 'Recomendação não encontrada.' using errcode = 'P0002'; end if;
  end if;
  return v_rid;
end $$;

-- Marca de ciclo de vida de qualquer item do cadastro, pela chave do front:
--   org|<org>   pil|<org>|<estudo>   rec|<org>|<estudo>|<rid>   aca|<org>|<estudo>|<codigo>
-- p_campos aceita apagado, arquivado e (só no estudo) oculto. As datas são do servidor.
create or replace function public.marcar_item(p_chave text, p_campos jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  p text[] := string_to_array(p_chave, '|');
  v_apagado boolean := (p_campos ->> 'apagado')::boolean;
  v_arquivado boolean := (p_campos ->> 'arquivado')::boolean;
  v_oculto boolean := (p_campos ->> 'oculto')::boolean;
begin
  perform public.exige_gestor();
  if p[1] = 'org' then
    if v_apagado and exists (select 1 from public.orgaos where id = p[2] and tipo = 'sefa') then
      raise exception 'A coordenação não pode ser excluída.' using errcode = '22023';
    end if;
    update public.orgaos set
      apagado    = coalesce(v_apagado, apagado),
      apagado_em = case when v_apagado then now() else apagado_em end
     where id = p[2];
  elsif p[1] = 'pil' then
    update public.estudos set
      apagado      = coalesce(v_apagado, apagado),
      apagado_em   = case when v_apagado then now() else apagado_em end,
      arquivado    = coalesce(v_arquivado, arquivado),
      arquivado_em = case when v_arquivado then now() else arquivado_em end,
      oculto       = coalesce(v_oculto, oculto)
     where org_id = p[2] and id = p[3];
  elsif p[1] = 'rec' then
    update public.recomendacoes set
      apagado      = coalesce(v_apagado, apagado),
      apagado_em   = case when v_apagado then now() else apagado_em end,
      arquivado    = coalesce(v_arquivado, arquivado),
      arquivado_em = case when v_arquivado then now() else arquivado_em end
     where org_id = p[2] and estudo_id = p[3] and rid = p[4];
  elsif p[1] = 'aca' then
    update public.acoes set
      apagado      = coalesce(v_apagado, apagado),
      apagado_em   = case when v_apagado then now() else apagado_em end,
      arquivado    = coalesce(v_arquivado, arquivado),
      arquivado_em = case when v_arquivado then now() else arquivado_em end
     where org_id = p[2] and estudo_id = p[3] and codigo = p[4];
  else
    raise exception 'Chave inválida: %', p_chave using errcode = '22023';
  end if;
  if not found then raise exception 'Item não encontrado.' using errcode = 'P0002'; end if;
end $$;

-- Exclusão definitiva de um item que está em Apagados. Sai junto tudo o que
-- depende dele (estudos, recomendações, ações, evidências, histórico e
-- acessos). Devolve os caminhos dos anexos, que o cliente remove do Storage.
-- Item que já não existe (saiu junto com o pai) não é erro: devolve vazio.
create or replace function public.apagar_definitivo(p_chave text)
returns text[] language plpgsql security definer set search_path = '' as $$
declare
  p text[] := string_to_array(p_chave, '|');
  v_caminhos text[];
begin
  perform public.exige_gestor();
  select coalesce(array_agg(an.caminho), '{}') into v_caminhos
    from public.anexos an join public.evidencias ev on ev.id = an.evidencia_id
   where ev.org_id = p[2]
     and (p[1] = 'org'
       or (p[1] = 'pil' and ev.estudo_id = p[3])
       or (p[1] = 'rec' and ev.estudo_id = p[3] and exists (
             select 1 from public.acoes a where a.org_id = ev.org_id and a.estudo_id = ev.estudo_id
                                            and a.codigo = ev.codigo and a.rid = p[4]))
       or (p[1] = 'aca' and ev.estudo_id = p[3] and ev.codigo = p[4]));

  if p[1] = 'org' then
    delete from public.orgaos where id = p[2] and apagado and tipo <> 'sefa';
  elsif p[1] = 'pil' then
    delete from public.estudos where org_id = p[2] and id = p[3] and apagado;
  elsif p[1] = 'rec' then
    delete from public.recomendacoes where org_id = p[2] and estudo_id = p[3] and rid = p[4] and apagado;
  elsif p[1] = 'aca' then
    delete from public.acoes where org_id = p[2] and estudo_id = p[3] and codigo = p[4] and apagado;
  else
    raise exception 'Chave inválida: %', p_chave using errcode = '22023';
  end if;
  if not found then return '{}'; end if;
  return v_caminhos;
end $$;

-- ---------------------------------------------------------------- ações (coordenação)

-- Cria uma ação na recomendação, ou uma por exercício até 2030 quando
-- recorrente. O prazo vale só para a primeira. Devolve os códigos criados.
create or replace function public.criar_acao(
  p_org text, p_estudo text, p_rid text, p_dados jsonb, p_prazo date, p_recorrente boolean)
returns text[] language plpgsql security definer set search_path = '' as $$
declare
  r public.recomendacoes;
  v_seq integer;
  v_ordem integer;
  v_ano integer;
  v_anos integer[];
  v_cod text;
  v_cods text[] := '{}';
  d jsonb := coalesce(p_dados, '{}'::jsonb);
  ANO_LIMITE constant integer := 2030;
begin
  perform public.exige_gestor();
  if btrim(coalesce(d ->> 'titulo', '')) = '' then
    raise exception 'Informe o título da ação.' using errcode = '22023';
  end if;
  select * into r from public.recomendacoes
   where org_id = p_org and estudo_id = p_estudo and rid = p_rid for update;
  if r.rid is null then raise exception 'Recomendação não encontrada.' using errcode = 'P0002'; end if;

  -- o sufixo conta todas as ações da recomendação, inclusive apagadas e arquivadas
  select coalesce(max(split_part(codigo, '.', 2)::integer), 0), coalesce(max(ordem), 0)
    into v_seq, v_ordem
    from public.acoes where org_id = p_org and estudo_id = p_estudo and rid = p_rid;

  v_anos := case when coalesce(p_recorrente, false)
                 then array(select generate_series(extract(year from current_date)::integer, ANO_LIMITE))
                 else array[null::integer] end;
  foreach v_ano in array v_anos loop
    v_seq := v_seq + 1; v_ordem := v_ordem + 1;
    v_cod := r.numero || '.' || v_seq;
    insert into public.acoes (org_id, estudo_id, codigo, rid, ordem, titulo, descricao, responsavel,
                              area, pessoa, produto, resultado, ciclo, origem, prazo)
    values (p_org, p_estudo, v_cod, p_rid, v_ordem,
            btrim(d ->> 'titulo'), btrim(coalesce(d ->> 'descricao', '')),
            btrim(coalesce(d ->> 'responsavel', '')), btrim(coalesce(d ->> 'area', '')),
            btrim(coalesce(d ->> 'pessoa', '')), btrim(coalesce(d ->> 'produto', '')),
            btrim(coalesce(d ->> 'resultado', '')), v_ano, 'coordenacao',
            case when cardinality(v_cods) = 0 then p_prazo end);
    v_cods := v_cods || v_cod;
  end loop;
  return v_cods;
end $$;

-- Edição estrutural pela coordenação: ficha e prazo pactuado. Não entra no
-- histórico (o histórico é o registro de acompanhamento da secretaria).
-- Só os campos presentes em p_campos mudam.
create or replace function public.editar_acao(p_org text, p_estudo text, p_codigo text, p_campos jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare c jsonb := coalesce(p_campos, '{}'::jsonb);
begin
  perform public.exige_gestor();
  update public.acoes set
    titulo      = case when c ? 'titulo'      then btrim(coalesce(c ->> 'titulo', ''))      else titulo end,
    descricao   = case when c ? 'descricao'   then btrim(coalesce(c ->> 'descricao', ''))   else descricao end,
    responsavel = case when c ? 'responsavel' then btrim(coalesce(c ->> 'responsavel', '')) else responsavel end,
    area        = case when c ? 'area'        then btrim(coalesce(c ->> 'area', ''))        else area end,
    pessoa      = case when c ? 'pessoa'      then btrim(coalesce(c ->> 'pessoa', ''))      else pessoa end,
    produto     = case when c ? 'produto'     then btrim(coalesce(c ->> 'produto', ''))     else produto end,
    resultado   = case when c ? 'resultado'   then btrim(coalesce(c ->> 'resultado', ''))   else resultado end,
    prazo       = case when c ? 'prazo' then nullif(btrim(coalesce(c ->> 'prazo', '')), '')::date else prazo end,
    atualizado_em = now()
  where org_id = p_org and estudo_id = p_estudo and codigo = p_codigo;
  if not found then raise exception 'Ação não encontrada.' using errcode = 'P0002'; end if;
end $$;

-- ---------------------------------------------------------------- acompanhamento (secretaria)

-- Grava a janela "Atualizar o acompanhamento da ação": situação, progresso,
-- justificativa e, se houver, uma evidência com anexos já enviados ao Storage.
-- Registra no histórico a data e a hora do servidor, o e-mail do login, o
-- nome informado, o que mudou e a janela como foi salva.
-- p_evidencia: { data: 'AAAA-MM-DD', texto, anexos: [{nome, tamanho, tipo, caminho}] }
-- Devolve a quantidade de mudanças registradas.
create or replace function public.atualizar_acompanhamento(
  p_org text, p_estudo text, p_codigo text, p_status text, p_progresso integer,
  p_justificativa text, p_autor text, p_evidencia jsonb default null)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  a public.acoes;
  r public.recomendacoes;
  v_email text;
  v_just text := btrim(coalesce(p_justificativa, ''));
  v_prog integer := greatest(0, least(100, coalesce(p_progresso, 0)));
  v_prog_antes text;
  v_mud jsonb := '[]'::jsonb;
  v_ev_id uuid;
  v_texto text := btrim(coalesce(p_evidencia ->> 'texto', ''));
  v_prefixo text := p_org || '/' || p_estudo || '/' || p_codigo || '/';
  x jsonb;
begin
  if not public.pode_atualizar_estudo(p_org, p_estudo) then
    raise exception 'Sem permissão para atualizar este estudo.' using errcode = '42501';
  end if;
  if btrim(coalesce(p_autor, '')) = '' then
    raise exception 'Informe o nome de quem está registrando a atualização.' using errcode = '22023';
  end if;
  if p_status is null or p_status not in ('nao_iniciada', 'em_execucao', 'aguardando', 'concluida') then
    raise exception 'Situação inválida.' using errcode = '22023';
  end if;

  select * into a from public.acoes
   where org_id = p_org and estudo_id = p_estudo and codigo = p_codigo for update;
  if a.codigo is null or a.apagado then
    raise exception 'Ação não encontrada.' using errcode = 'P0002';
  end if;
  select * into r from public.recomendacoes where org_id = p_org and estudo_id = p_estudo and rid = a.rid;
  if a.arquivado or r.arquivado or r.apagado then
    raise exception 'Ação arquivada: disponível só para consulta.' using errcode = '42501';
  end if;

  select email into v_email from public.usuarios where id = auth.uid();

  -- o que mudou (mesmos rótulos da ficha do front)
  v_prog_antes := coalesce(a.progresso, case when a.status = 'concluida' then 100 else 0 end)::text;
  if a.status <> p_status then
    v_mud := v_mud || jsonb_build_object('campo', 'status', 'rotulo', 'Situação', 'de', a.status, 'para', p_status);
  end if;
  if v_prog_antes <> v_prog::text then
    v_mud := v_mud || jsonb_build_object('campo', 'progresso', 'rotulo', 'Progresso', 'de', v_prog_antes, 'para', v_prog::text);
  end if;
  if coalesce(a.justificativa, '') <> v_just then
    v_mud := v_mud || jsonb_build_object('campo', 'justificativa', 'rotulo', 'Justificativa',
                                         'de', coalesce(a.justificativa, ''), 'para', v_just);
  end if;

  -- evidência e anexos (os arquivos precisam já estar no bucket, na pasta da ação)
  if v_texto <> '' then
    insert into public.evidencias (org_id, estudo_id, codigo, data, texto, criado_por)
    values (p_org, p_estudo, p_codigo,
            coalesce(nullif(p_evidencia ->> 'data', '')::date, current_date), v_texto, auth.uid())
    returning id into v_ev_id;
    for x in select * from jsonb_array_elements(coalesce(p_evidencia -> 'anexos', '[]'::jsonb)) loop
      if left(x ->> 'caminho', length(v_prefixo)) <> v_prefixo
         or not exists (select 1 from storage.objects o
                         where o.bucket_id = 'evidencias' and o.name = x ->> 'caminho') then
        raise exception 'Anexo inválido: %', x ->> 'nome' using errcode = '22023';
      end if;
      insert into public.anexos (evidencia_id, nome, tamanho, tipo, caminho)
      values (v_ev_id, coalesce(x ->> 'nome', ''), coalesce((x ->> 'tamanho')::bigint, 0),
              coalesce(x ->> 'tipo', ''), x ->> 'caminho');
    end loop;
    v_mud := v_mud || jsonb_build_object('campo', 'evidencia', 'rotulo', 'Evidência anexada', 'de', '', 'para', v_texto);
  end if;

  update public.acoes
     set status = p_status, progresso = v_prog, justificativa = v_just, atualizado_em = now()
   where org_id = p_org and estudo_id = p_estudo and codigo = p_codigo;

  insert into public.historico (org_id, estudo_id, codigo, tipo, autor, email, campos, mudancas, usuario_id)
  values (p_org, p_estudo, p_codigo, 'edicao', btrim(p_autor), coalesce(v_email, ''),
          jsonb_build_object(
            'titulo', a.titulo, 'descricao', a.descricao, 'responsavel', a.responsavel,
            'area', a.area, 'pessoa', a.pessoa, 'produto', a.produto, 'resultado', a.resultado,
            'status', p_status, 'prazo', coalesce(a.prazo::text, ''), 'progresso', v_prog::text,
            'justificativa', v_just),
          v_mud, auth.uid());

  return jsonb_array_length(v_mud);
end $$;

-- Remove uma evidência (e os anexos) de uma ação. Devolve os caminhos dos
-- arquivos, que o cliente remove do Storage.
create or replace function public.remover_evidencia(p_id uuid)
returns text[] language plpgsql security definer set search_path = '' as $$
declare
  ev public.evidencias;
  v_caminhos text[];
begin
  select * into ev from public.evidencias where id = p_id;
  if ev.id is null then return '{}'; end if;
  if not public.pode_atualizar_estudo(ev.org_id, ev.estudo_id) then
    raise exception 'Sem permissão para alterar este estudo.' using errcode = '42501';
  end if;
  select coalesce(array_agg(caminho), '{}') into v_caminhos from public.anexos where evidencia_id = p_id;
  delete from public.evidencias where id = p_id;
  return v_caminhos;
end $$;

-- ---------------------------------------------------------------- permissões das funções

revoke execute on all functions in schema public from public, anon;
grant execute on function public.orgaos_publicos() to anon, authenticated;
grant execute on function
  public.eh_gestor(), public.pode_ver_estudo(text, text), public.pode_atualizar_estudo(text, text),
  public.verificar_acesso(text),
  public.salvar_orgao(text, text, text, text),
  public.salvar_estudo(text, text, text, text, text, jsonb, text, text, text),
  public.salvar_recomendacao(text, text, text, text, text, text, jsonb),
  public.marcar_item(text, jsonb), public.apagar_definitivo(text),
  public.criar_acao(text, text, text, jsonb, date, boolean),
  public.editar_acao(text, text, text, jsonb),
  public.atualizar_acompanhamento(text, text, text, text, integer, text, text, jsonb),
  public.remover_evidencia(uuid)
to authenticated;
-- funções internas: só pelo dono
revoke execute on function public.exige_gestor(), public.id_novo(text) from authenticated;

-- ---------------------------------------------------------------- storage: anexos das evidências
-- Caminho do objeto: <org>/<estudo>/<codigo da ação>/<uuid>/<arquivo>

insert into storage.buckets (id, name, public, file_size_limit)
values ('evidencias', 'evidencias', false, 26214400)   -- 25 MB por arquivo
on conflict (id) do nothing;

create policy evidencias_ler on storage.objects for select to authenticated
  using (bucket_id = 'evidencias'
         and public.pode_ver_estudo((storage.foldername(name))[1], (storage.foldername(name))[2]));

create policy evidencias_enviar on storage.objects for insert to authenticated
  with check (bucket_id = 'evidencias'
              and public.pode_atualizar_estudo((storage.foldername(name))[1], (storage.foldername(name))[2]));

create policy evidencias_remover on storage.objects for delete to authenticated
  using (bucket_id = 'evidencias'
         and (public.eh_gestor()
              or public.pode_atualizar_estudo((storage.foldername(name))[1], (storage.foldername(name))[2])));
