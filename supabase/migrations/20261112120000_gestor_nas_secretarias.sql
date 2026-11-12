-- SAEQG · gestor também entra pelas secretarias
--
-- O gestor (SEFA) passa a entrar, com o mesmo login, pela coordenação ou por
-- qualquer secretaria, e a alternar entre elas sem sair. Dentro da
-- secretaria ele usa a mesma tela que ela, inclusive a janela "Atualizar o
-- acompanhamento", que registra no histórico o e-mail dele.
--
-- O usuário restrito não muda: só entra nas secretarias e nos estudos
-- marcados no cadastro, e continua barrado na coordenação.

comment on table public.usuarios is
  'Cadastros de acesso. gestor = coordenação (SEFA) e todas as secretarias; restrito = só os estudos de usuario_acessos.';

-- ---------------------------------------------------------------- entrada pelo órgão

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
  if o.tipo <> 'sefa' and u.nivel <> 'gestor'
     and not exists (select 1 from public.usuario_acessos where usuario_id = u.id and org_id = o.id) then
    return jsonb_build_object('ok', false, 'erro', 'Este usuário não tem acesso a este órgão.');
  end if;
  return jsonb_build_object('ok', true, 'perfil', o.id,
                            'usuario', jsonb_build_object('email', u.email, 'nivel', u.nivel));
end $$;

-- ---------------------------------------------------------------- acompanhamento

-- Restrito com acesso ao estudo, ou gestor em qualquer estudo; em ambos os
-- casos o estudo precisa estar no ar e não arquivado.
create or replace function public.pode_atualizar_estudo(p_org text, p_estudo text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
      from public.estudos e
      join public.orgaos  o on o.id = e.org_id
     where e.org_id = p_org and e.id = p_estudo
       and not e.apagado and not e.oculto and not e.arquivado and not o.apagado
       and (public.eh_gestor() or exists (
             select 1
               from public.usuarios u
               join public.usuario_acessos ua on ua.usuario_id = u.id
              where u.id = auth.uid() and u.nivel = 'restrito'
                and ua.org_id = e.org_id and ua.estudo_id = e.id)));
$$;
