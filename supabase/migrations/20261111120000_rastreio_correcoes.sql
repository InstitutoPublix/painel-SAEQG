-- SAEQG · rastreio das correções no histórico da ação
--
-- 1. Remoção de evidência. Pode remover a secretaria, no estudo em que ela
--    atualiza o acompanhamento, ou o gestor, em qualquer estudo (arquivo
--    errado, documento com dado pessoal). Nome e motivo são obrigatórios. A
--    remoção entra no histórico (tipo 'remocao') com o texto da evidência e
--    o nome dos anexos; os arquivos saem do Storage.
-- 2. Edição estrutural do gestor (ficha e prazo pactuado) passa a entrar no
--    histórico (tipo 'coordenacao'), com o que mudou.
--
-- O histórico continua sem edição nem exclusão: só sai junto com a ação,
-- na exclusão definitiva.

alter table public.historico drop constraint historico_tipo_check;
alter table public.historico add constraint historico_tipo_check
  check (tipo in ('edicao', 'rapida', 'coordenacao', 'remocao'));

-- ---------------------------------------------------------------- remoção de evidência

-- A assinatura muda (nome e motivo); a antiga sai para não sobrar um
-- caminho de remoção sem registro.
drop function public.remover_evidencia(uuid);

-- Devolve os caminhos dos arquivos, que o cliente remove do Storage.
create function public.remover_evidencia(p_id uuid, p_motivo text, p_autor text)
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

  insert into public.historico (org_id, estudo_id, codigo, tipo, autor, email, campos, mudancas, usuario_id)
  values (ev.org_id, ev.estudo_id, ev.codigo, 'remocao', v_autor, coalesce(v_email, ''),
          jsonb_build_object(
            'motivo', v_motivo,
            'evidencia', jsonb_build_object('data', ev.data, 'texto', ev.texto, 'anexos', v_anexos,
                                            'registrada_em', ev.criado_em)),
          jsonb_build_array(jsonb_build_object('campo', 'evidencia_removida', 'rotulo', 'Evidência removida',
                                               'de', ev.texto, 'para', '')),
          auth.uid());

  delete from public.evidencias where id = p_id;
  return v_caminhos;
end $$;

-- ---------------------------------------------------------------- edição estrutural (gestor)

-- Mesma gravação de antes; agora compara com o que havia e registra no
-- histórico o que mudou (mesmos rótulos da ficha do front).
create or replace function public.editar_acao(p_org text, p_estudo text, p_codigo text, p_campos jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare
  c jsonb := coalesce(p_campos, '{}'::jsonb);
  a public.acoes;
  n public.acoes;
  v_email text;
  v_mud jsonb := '[]'::jsonb;
  v_de text;
  v_para text;
  f record;
begin
  perform public.exige_gestor();
  select * into a from public.acoes
   where org_id = p_org and estudo_id = p_estudo and codigo = p_codigo for update;
  if a.codigo is null then raise exception 'Ação não encontrada.' using errcode = 'P0002'; end if;

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
  where org_id = p_org and estudo_id = p_estudo and codigo = p_codigo
  returning * into n;

  for f in select * from (values
      ('titulo', 'Título da ação'), ('descricao', 'Descrição'),
      ('responsavel', 'Responsável (unidade ou órgão)'), ('area', 'Área responsável'),
      ('pessoa', 'Pessoa responsável'), ('produto', 'Produto esperado'),
      ('resultado', 'Resultado esperado'), ('prazo', 'Prazo pactuado')) as x(campo, rotulo)
  loop
    v_de   := coalesce(to_jsonb(a) ->> f.campo, '');
    v_para := coalesce(to_jsonb(n) ->> f.campo, '');
    if v_de <> v_para then
      v_mud := v_mud || jsonb_build_object('campo', f.campo, 'rotulo', f.rotulo, 'de', v_de, 'para', v_para);
    end if;
  end loop;
  if jsonb_array_length(v_mud) = 0 then return; end if;

  select email into v_email from public.usuarios where id = auth.uid();
  insert into public.historico (org_id, estudo_id, codigo, tipo, autor, email, campos, mudancas, usuario_id)
  values (p_org, p_estudo, p_codigo, 'coordenacao', 'Coordenação (SEFA)', coalesce(v_email, ''),
          jsonb_build_object(
            'titulo', n.titulo, 'descricao', n.descricao, 'responsavel', n.responsavel,
            'area', n.area, 'pessoa', n.pessoa, 'produto', n.produto, 'resultado', n.resultado,
            'status', n.status, 'prazo', coalesce(n.prazo::text, ''),
            'progresso', coalesce(n.progresso, case when n.status = 'concluida' then 100 else 0 end)::text,
            'justificativa', coalesce(n.justificativa, '')),
          v_mud, auth.uid());
end $$;

-- ---------------------------------------------------------------- permissões

revoke execute on function public.remover_evidencia(uuid, text, text) from public, anon;
grant execute on function public.remover_evidencia(uuid, text, text) to authenticated;
