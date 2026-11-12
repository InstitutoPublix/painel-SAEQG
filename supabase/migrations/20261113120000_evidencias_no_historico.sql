-- SAEQG · evidências no histórico de atualizações
--
-- Cada atualização que anexou uma evidência passa a apontar para ela
-- (historico.evidencia_id). O histórico mostra, na própria atualização, o
-- texto e os anexos daquela evidência, para baixar, a quem vê o estudo: o
-- restrito, nos estudos liberados para ele, e o gestor, em todos. A leitura
-- e o download continuam pelas mesmas regras (RLS de evidencias e anexos e
-- a policy evidencias_ler do Storage); nada muda nelas.
--
-- A remoção de evidência grava o mesmo id, e a atualização que a anexou
-- passa a mostrar quando, por quem e por que ela saiu. A coluna não tem
-- chave estrangeira de propósito: a evidência removida deixa de existir,
-- mas o histórico não muda (só sai junto com a ação).

alter table public.historico add column if not exists evidencia_id uuid;
comment on column public.historico.evidencia_id is
  'Evidência anexada (tipo edicao) ou removida (tipo remocao) neste registro do histórico.';
create index if not exists historico_evidencia_idx on public.historico (evidencia_id)
  where evidencia_id is not null;

-- ---------------------------------------------------------------- registros já gravados

-- 1. Evidência que ainda existe. Ela e o registro do histórico foram
--    gravados na mesma transação (atualizar_acompanhamento), e por isso
--    têm o mesmo now(): evidencias.criado_em = historico.em.
update public.historico h
   set evidencia_id = ev.id
  from public.evidencias ev
 where h.tipo = 'edicao' and h.evidencia_id is null
   and h.mudancas @> '[{"campo":"evidencia"}]'
   and ev.org_id = h.org_id and ev.estudo_id = h.estudo_id and ev.codigo = h.codigo
   and ev.criado_em = h.em;

-- 2. Evidência já removida. A remoção guardou o momento em que ela foi
--    registrada (campos.evidencia.registrada_em), que é o "em" da
--    atualização que a anexou. O id original se perdeu com a remoção; um id
--    novo liga os dois registros.
with par as materialized (
  select a.id as atualizacao, r.id as remocao, gen_random_uuid() as novo
    from public.historico r
    join public.historico a
      on a.org_id = r.org_id and a.estudo_id = r.estudo_id and a.codigo = r.codigo
     and a.tipo = 'edicao' and a.evidencia_id is null
     and a.mudancas @> '[{"campo":"evidencia"}]'
     and a.em = (r.campos -> 'evidencia' ->> 'registrada_em')::timestamptz
   where r.tipo = 'remocao' and r.evidencia_id is null
     and r.campos -> 'evidencia' ? 'registrada_em'
)
update public.historico h
   set evidencia_id = par.novo
  from par
 where h.id = par.atualizacao or h.id = par.remocao;

-- ---------------------------------------------------------------- atualização (secretaria e gestor)

-- Mesma gravação de antes (20261110120000_schema.sql); o registro do
-- histórico passa a levar o id da evidência anexada.
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

  insert into public.historico (org_id, estudo_id, codigo, tipo, autor, email, campos, mudancas, usuario_id,
                                evidencia_id)
  values (p_org, p_estudo, p_codigo, 'edicao', btrim(p_autor), coalesce(v_email, ''),
          jsonb_build_object(
            'titulo', a.titulo, 'descricao', a.descricao, 'responsavel', a.responsavel,
            'area', a.area, 'pessoa', a.pessoa, 'produto', a.produto, 'resultado', a.resultado,
            'status', p_status, 'prazo', coalesce(a.prazo::text, ''), 'progresso', v_prog::text,
            'justificativa', v_just),
          v_mud, auth.uid(), v_ev_id);

  return jsonb_array_length(v_mud);
end $$;

-- ---------------------------------------------------------------- remoção de evidência

-- Mesma gravação de antes (20261111120000_rastreio_correcoes.sql); o
-- registro da remoção passa a levar o id da evidência removida.
create or replace function public.remover_evidencia(p_id uuid, p_motivo text, p_autor text)
returns text[] language plpgsql security definer set search_path = '' as $$
declare
  ev public.evidencias;
  v_motivo text := btrim(coalesce(p_motivo, ''));
  v_autor text := btrim(coalesce(p_autor, ''));
  v_email text;
  v_anexos jsonb;
  v_caminhos text[];
begin
  select * into ev from public.evidencias where id = p_id for update;
  -- já removida por outra pessoa: nada a fazer
  if ev.id is null then return '{}'; end if;
  if not (public.eh_gestor() or public.pode_atualizar_estudo(ev.org_id, ev.estudo_id)) then
    raise exception 'Sem permissão para remover evidência deste estudo.' using errcode = '42501';
  end if;
  if v_autor = '' then
    raise exception 'Informe o nome de quem está removendo a evidência.' using errcode = '22023';
  end if;
  if v_motivo = '' then
    raise exception 'Informe o motivo da remoção.' using errcode = '22023';
  end if;

  select email into v_email from public.usuarios where id = auth.uid();
  select coalesce(array_agg(caminho order by criado_em), '{}'),
         coalesce(jsonb_agg(jsonb_build_object('nome', nome, 'tamanho', tamanho) order by criado_em), '[]'::jsonb)
    into v_caminhos, v_anexos
    from public.anexos where evidencia_id = p_id;

  insert into public.historico (org_id, estudo_id, codigo, tipo, autor, email, campos, mudancas, usuario_id,
                                evidencia_id)
  values (ev.org_id, ev.estudo_id, ev.codigo, 'remocao', v_autor, coalesce(v_email, ''),
          jsonb_build_object(
            'motivo', v_motivo,
            'evidencia', jsonb_build_object('data', ev.data, 'texto', ev.texto, 'anexos', v_anexos,
                                            'registrada_em', ev.criado_em)),
          jsonb_build_array(jsonb_build_object('campo', 'evidencia_removida', 'rotulo', 'Evidência removida',
                                               'de', ev.texto, 'para', '')),
          auth.uid(), ev.id);

  delete from public.evidencias where id = p_id;
  return v_caminhos;
end $$;

-- As permissões das duas funções não mudam: create or replace as mantém.
