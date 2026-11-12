-- SAEQG · testes das regras de acesso e das funções de escrita.
-- Roda numa única transação e desfaz tudo no fim (rollback): não altera dados.
-- Pressupõe a carga inicial intacta (rode logo depois de `supabase db reset`).
--
--   psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/tests/regras_de_acesso.sql
--
-- Cada verificação imprime "ok ..." ; a primeira falha interrompe com erro.
\set ON_ERROR_STOP 1
\set QUIET 1
\pset tuples_only on
begin;
-- Usuários de teste
insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-00000000000a', 'teste.gestor@saeqg.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000b', 'teste.restrito@saeqg.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000c', 'teste.semperfil@saeqg.invalid', 'authenticated', 'authenticated');
insert into public.usuarios (id, email, nivel) values
  ('00000000-0000-0000-0000-00000000000a', 'teste.gestor@saeqg.invalid', 'gestor'),
  ('00000000-0000-0000-0000-00000000000b', 'teste.restrito@saeqg.invalid', 'restrito');
insert into public.usuario_acessos values ('00000000-0000-0000-0000-00000000000b', 'seab', 'p1');

create or replace function pg_temp.ok(cond boolean, nome text) returns void language plpgsql as $$
begin
  if cond is distinct from true then raise exception 'FALHOU: %', nome; end if;
  raise notice 'ok  %', nome;
end $$;
create or replace function pg_temp.como(uid text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
  perform set_config('request.jwt.claim.sub', uid, true);
end $$;

-- ------------------------------------------------------------ anônimo
reset role;
set local role anon;
select pg_temp.ok((select count(*) from public.orgaos_publicos()) = 9, 'anon: orgaos_publicos lista 9 órgãos');
select pg_temp.ok((select bool_and(no_ar) from public.orgaos_publicos()), 'anon: todos no ar');
do $$ begin
  perform count(*) from public.orgaos;
  raise exception 'FALHOU: anon leu orgaos';
exception when insufficient_privilege then raise notice 'ok  anon: sem leitura direta das tabelas';
end $$;
do $$ begin
  perform public.salvar_orgao(null, 'X', 'X', 'X');
  raise exception 'FALHOU: anon chamou salvar_orgao';
exception when insufficient_privilege then raise notice 'ok  anon: sem acesso às funções de escrita';
end $$;

-- ------------------------------------------------------------ restrito
reset role;
select pg_temp.como('00000000-0000-0000-0000-00000000000b');
set local role authenticated;
select pg_temp.ok((public.verificar_acesso('seab') ->> 'ok')::boolean, 'restrito: entra na SEAB');
select pg_temp.ok(public.verificar_acesso('sesa') ->> 'erro' = 'Este usuário não tem acesso a este órgão.', 'restrito: barrado na SESA');
select pg_temp.ok(public.verificar_acesso('sefa') ->> 'erro' = 'Este usuário não tem acesso à coordenação.', 'restrito: barrado na SEFA');
select pg_temp.ok((select count(*) from public.orgaos) = 1, 'restrito: vê só o próprio órgão');
select pg_temp.ok((select count(*) from public.estudos) = 1, 'restrito: vê só o estudo liberado');
select pg_temp.ok((select count(*) from public.acoes) = 10, 'restrito: vê as 10 ações da SEAB');
select pg_temp.ok((select count(*) from public.usuarios) = 1, 'restrito: vê só o próprio cadastro');
do $$ begin
  perform public.salvar_orgao(null, 'X', 'X', 'X');
  raise exception 'FALHOU: restrito cadastrou órgão';
exception when insufficient_privilege then raise notice 'ok  restrito: não cadastra órgão';
end $$;
do $$ begin
  perform public.atualizar_acompanhamento('sesa', 'p1', '1.1', 'em_execucao', 10, 'x', 'Fulano', null);
  raise exception 'FALHOU: restrito atualizou outro órgão';
exception when insufficient_privilege then raise notice 'ok  restrito: não atualiza ação de outro órgão';
end $$;
do $$ begin
  perform public.atualizar_acompanhamento('seab', 'p1', '1.1', 'em_execucao', 10, 'x', '  ', null);
  raise exception 'FALHOU: aceitou autor vazio';
exception when invalid_parameter_value then raise notice 'ok  restrito: nome do autor obrigatório';
end $$;
-- upload simulado (a policy do bucket é a que vale aqui)
insert into storage.objects (bucket_id, name) values ('evidencias', 'seab/p1/1.1/u1/relatorio.pdf');
do $$ begin
  insert into storage.objects (bucket_id, name) values ('evidencias', 'sesa/p1/1.1/u1/x.pdf');
  raise exception 'FALHOU: upload em pasta de outro órgão';
exception when insufficient_privilege then raise notice 'ok  storage: upload só na pasta do próprio estudo';
end $$;
select pg_temp.ok(public.atualizar_acompanhamento('seab', 'p1', '1.1', 'em_execucao', 40, 'Em campo', 'Fulano de Tal',
  '{"data":"2026-11-01","texto":"Relatório parcial","anexos":[{"nome":"relatório.pdf","tamanho":1234,"tipo":"application/pdf","caminho":"seab/p1/1.1/u1/relatorio.pdf"}]}') = 4,
  'restrito: atualização registra 4 mudanças (situação, progresso, justificativa, evidência)');
select pg_temp.ok((select status = 'em_execucao' and progresso = 40 from public.acoes where org_id='seab' and codigo='1.1'), 'ação atualizada');
select pg_temp.ok((select email = 'teste.restrito@saeqg.invalid' and autor = 'Fulano de Tal' and campos->>'progresso' = '40'
                     from public.historico where org_id='seab' and codigo='1.1'), 'histórico com e-mail, autor e janela');
select pg_temp.ok((select count(*) from public.anexos) = 1, 'anexo registrado');
do $$ begin
  perform public.atualizar_acompanhamento('seab', 'p1', '1.1', 'concluida', 100, 'x', 'Fulano',
    '{"texto":"t","anexos":[{"nome":"x","caminho":"seab/p1/1.1/u9/nao-existe.pdf"}]}');
  raise exception 'FALHOU: aceitou anexo inexistente';
exception when invalid_parameter_value then raise notice 'ok  anexo precisa existir no bucket';
end $$;
select pg_temp.ok(public.atualizar_acompanhamento('seab', 'p1', '1.1', 'em_execucao', 40, 'Em campo', 'Fulano', null) = 0,
  'salvar sem mudança registra 0 mudanças');
do $$ begin
  perform public.remover_evidencia((select id from public.evidencias limit 1), '  ', 'Fulano');
  raise exception 'FALHOU: removeu evidência sem motivo';
exception when invalid_parameter_value then raise notice 'ok  remover evidência exige motivo';
end $$;
do $$ begin
  perform public.remover_evidencia((select id from public.evidencias limit 1), 'Arquivo errado', '');
  raise exception 'FALHOU: removeu evidência sem nome';
exception when invalid_parameter_value then raise notice 'ok  remover evidência exige nome';
end $$;
select pg_temp.ok(array_length(public.remover_evidencia((select id from public.evidencias limit 1), 'Arquivo errado', 'Fulano'), 1) = 1,
  'remover evidência devolve o caminho do anexo');
select pg_temp.ok((select autor = 'Fulano' and email = 'teste.restrito@saeqg.invalid'
                          and campos ->> 'motivo' = 'Arquivo errado'
                          and campos -> 'evidencia' ->> 'texto' = 'Relatório parcial'
                          and campos -> 'evidencia' -> 'anexos' -> 0 ->> 'nome' = 'relatório.pdf'
                     from public.historico where org_id='seab' and codigo='1.1' and tipo = 'remocao'),
  'remoção registrada no histórico com motivo, texto e anexos');
-- evidências fora do alcance do restrito (gravadas direto, como superusuário)
reset role;
insert into public.evidencias (id, org_id, estudo_id, codigo, texto) values
  ('00000000-0000-0000-0000-0000000000e1', 'sesa', 'p1', '1.1', 'Evidência da SESA'),
  ('00000000-0000-0000-0000-0000000000e2', 'seab', 'p1', '1.1', 'Evidência indevida');
select pg_temp.como('00000000-0000-0000-0000-00000000000b');
set local role authenticated;
do $$ begin
  perform public.remover_evidencia('00000000-0000-0000-0000-0000000000e1', 'x', 'Fulano');
  raise exception 'FALHOU: restrito removeu evidência de outro órgão';
exception when insufficient_privilege then raise notice 'ok  restrito: não remove evidência de outro órgão';
end $$;

-- ------------------------------------------------------------ usuário autenticado sem cadastro
reset role;
select pg_temp.como('00000000-0000-0000-0000-00000000000c');
set local role authenticated;
select pg_temp.ok(public.verificar_acesso('sefa') ->> 'erro' = 'Login ou senha inválidos.', 'sem cadastro: não entra');
select pg_temp.ok((select count(*) from public.acoes) = 0, 'sem cadastro: não lê nada');

-- ------------------------------------------------------------ gestor
reset role;
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set local role authenticated;
select pg_temp.ok((public.verificar_acesso('sefa') ->> 'ok')::boolean, 'gestor: entra na SEFA');
select pg_temp.ok((public.verificar_acesso('seab') ->> 'ok')::boolean, 'gestor: entra por secretaria');
select pg_temp.ok((public.verificar_acesso('sesa') ->> 'ok')::boolean, 'gestor: entra por qualquer secretaria');
select pg_temp.ok(public.pode_atualizar_estudo('seab', 'p1'), 'gestor: atualiza acompanhamento na secretaria');
select pg_temp.ok((select count(*) from public.acoes) = 88, 'gestor: vê todas as ações');
select pg_temp.ok((select count(*) from public.historico) = 3, 'gestor: vê o histórico da SEAB');
select pg_temp.ok(public.remover_evidencia('00000000-0000-0000-0000-0000000000e2', 'Documento com dados pessoais', 'Gestora') = '{}',
  'gestor: remove evidência de secretaria');
select pg_temp.ok((select count(*) from public.historico
                    where tipo = 'remocao' and email = 'teste.gestor@saeqg.invalid'
                      and campos ->> 'motivo' = 'Documento com dados pessoais') = 1,
  'gestor: remoção registrada no histórico');
select pg_temp.ok(public.remover_evidencia('00000000-0000-0000-0000-0000000000e2', 'x', 'y') = '{}',
  'remover evidência já removida não faz nada');

-- cadastro
create temp table t (k text, v text);
insert into t select 'org', public.salvar_orgao(null, 'SEJU', 'Justiça', 'Secretaria da Justiça');
insert into t select 'pil', public.salvar_estudo((select v from t where k='org'), null, 'Estudo novo', 'Programa X', 'Ação 1',
  '[["Do que se trata","Texto"]]', 'DOJ', 'Maria', 'maria@seju.pr.gov.br');
insert into t select 'rec', public.salvar_recomendacao((select v from t where k='org'), (select v from t where k='pil'), null,
  'Primeira', 'chamada', 'alvo', '["p1","p2"]');
select pg_temp.ok((select numero from public.recomendacoes where rid = (select v from t where k='rec')) = 1, 'nova recomendação recebe número 1');
do $$ begin
  perform public.salvar_estudo('seab', null, 'x', '', '', '[]', '', '', 'email-invalido');
  raise exception 'FALHOU: aceitou e-mail inválido';
exception when invalid_parameter_value then raise notice 'ok  e-mail do ponto focal validado';
end $$;

-- ações: simples e recorrente
select pg_temp.ok(public.criar_acao('seab', 'p1', 'r1', '{"titulo":"Nova ação"}', '2027-03-31', false) = array['1.8'], 'criar ação: código 1.8');
select pg_temp.ok((select prazo = '2027-03-31' and origem = 'coordenacao' from public.acoes where org_id='seab' and codigo='1.8'), 'prazo e origem gravados');
select pg_temp.ok(cardinality(public.criar_acao('seab', 'p1', 'r2', '{"titulo":"Anual"}', '2026-12-31', true))
                  = 2030 - extract(year from current_date)::int + 1, 'ação recorrente: uma por exercício até 2030');
select pg_temp.ok((select count(*) from public.acoes where org_id='seab' and rid='r2' and prazo is not null and ciclo is not null) = 1,
  'recorrente: prazo só na primeira');
select public.editar_acao('seab', 'p1', '1.2', '{"titulo":"Título revisto","prazo":"2027-01-15"}');
select pg_temp.ok((select titulo = 'Título revisto' and prazo = '2027-01-15' and descricao <> '' from public.acoes where org_id='seab' and codigo='1.2'),
  'edição estrutural muda só os campos enviados');
select pg_temp.ok((select tipo = 'coordenacao' and email = 'teste.gestor@saeqg.invalid'
                          and jsonb_array_length(mudancas) = 2
                          and mudancas @> '[{"campo":"titulo","para":"Título revisto"},{"campo":"prazo","para":"2027-01-15"}]'
                          and campos ->> 'prazo' = '2027-01-15'
                     from public.historico where org_id='seab' and codigo = '1.2'),
  'edição estrutural entra no histórico com o que mudou');
select public.editar_acao('seab', 'p1', '1.2', '{"titulo":"Título revisto"}');
select pg_temp.ok((select count(*) from public.historico where org_id='seab' and codigo = '1.2') = 1,
  'edição estrutural sem mudança não entra no histórico');

-- ciclo de vida
select public.marcar_item('aca|seab|p1|1.3', '{"arquivado":true}');
select pg_temp.ok((select arquivado and arquivado_em is not null from public.acoes where org_id='seab' and codigo='1.3'), 'arquivar ação');
select public.marcar_item('pil|seab|p1', '{"oculto":true}');
select public.marcar_item('rec|seab|p1|r2', '{"apagado":true}');
select pg_temp.ok(public.apagar_definitivo('rec|seab|p1|r1') = '{}', 'apagar definitivo só vale para item em Apagados');
select pg_temp.ok((select count(*) from public.recomendacoes where org_id='seab' and rid='r1') = 1, 'r1 continua');
select public.apagar_definitivo('rec|seab|p1|r2');
select pg_temp.ok((select count(*) from public.acoes where org_id='seab' and rid='r2') = 0, 'apagar recomendação leva as ações junto');
do $$ begin
  perform public.marcar_item('org|sefa', '{"apagado":true}');
  raise exception 'FALHOU: apagou a SEFA';
exception when invalid_parameter_value then raise notice 'ok  coordenação não pode ser excluída';
end $$;

-- ------------------------------------------------------------ restrito depois das mudanças
reset role;
select pg_temp.como('00000000-0000-0000-0000-00000000000b');
set local role authenticated;
select pg_temp.ok((select count(*) from public.estudos) = 0, 'restrito: estudo fora do ar some');
select pg_temp.ok(not exists (select 1 from public.orgaos_publicos() where id = 'seab' and no_ar), 'tela de acesso: SEAB em construção');
do $$ begin
  perform public.atualizar_acompanhamento('seab', 'p1', '1.1', 'concluida', 100, 'x', 'Fulano', null);
  raise exception 'FALHOU: atualizou estudo fora do ar';
exception when insufficient_privilege then raise notice 'ok  restrito: não atualiza estudo fora do ar';
end $$;

reset role;
select pg_temp.como('00000000-0000-0000-0000-00000000000a');
set local role authenticated;
select public.marcar_item('pil|seab|p1', '{"oculto":false,"arquivado":true}');
reset role;
select pg_temp.como('00000000-0000-0000-0000-00000000000b');
set local role authenticated;
select pg_temp.ok((select count(*) from public.estudos) = 1, 'restrito: estudo arquivado continua para consulta');
do $$ begin
  perform public.atualizar_acompanhamento('seab', 'p1', '1.1', 'concluida', 100, 'x', 'Fulano', null);
  raise exception 'FALHOU: atualizou estudo arquivado';
exception when insufficient_privilege then raise notice 'ok  restrito: estudo arquivado é só consulta';
end $$;
reset role;
rollback;
\echo 'todas as verificações passaram (alterações desfeitas)'
