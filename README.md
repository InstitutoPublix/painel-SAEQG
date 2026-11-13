# painel-SAEQG

SAEQG · Sistema de Acompanhamento dos Estudos da Qualidade do Gasto (programa Orçamento para Resultados, SEFA/PR).

O front é o mesmo do HTML original (a versão offline `Sistema de Acompanhamento dos Estudos da Qualidade do Gasto - vFinal.html`, mantida fora deste repositório), agora ligado a um backend em **Supabase**, que é o backend do **Lovable Cloud**. Nada foi acrescentado além do que as telas já faziam: os dados que viviam no `localStorage` de cada navegador passaram para o servidor, compartilhados e com controle de acesso.

## Arquitetura

```
navegador (Vite, HTML + JS)
   │  supabase-js
   ├── Auth ............ login por e-mail e senha (sessão por aba)
   ├── PostgREST ....... leitura das tabelas (RLS) e funções RPC de escrita
   ├── Storage ......... bucket privado "evidencias" (anexos)
   └── Edge Function ... "usuarios": criar, alterar e excluir contas (service role)
Postgres
   orgaos ─< estudos ─< recomendacoes ─< acoes ─< evidencias ─< anexos
                                              └─< historico
   usuarios (perfil de auth.users) ─< usuario_acessos >─ estudos
```

- **Leitura**: o cliente lê as tabelas direto. A RLS só devolve o que o usuário pode ver.
- **Escrita**: só por funções `security definer`, que conferem o papel de quem chama. Nenhuma tabela aceita `insert`, `update` ou `delete` do cliente.
- **Contas**: criar, trocar senha e excluir mexe em `auth.users` e exige a service role. Por isso fica na Edge Function, e a chave nunca vai ao navegador.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Markup e CSS do sistema (iguais ao original) |
| `src/main.js` | Lógica das telas (a do original, com a persistência trocada pelo servidor) |
| `src/api.js` | Acesso ao Supabase: login, leitura, RPCs, upload e download de anexos |
| `supabase/migrations/20261110120000_schema.sql` | Tabelas, RLS, funções RPC, bucket e políticas do Storage |
| `supabase/migrations/20261110120100_conteudo_inicial.sql` | Conteúdo dos relatórios finais: 9 órgãos, 8 estudos, 29 recomendações, 88 ações (gerado) |
| `supabase/migrations/20261111120000_rastreio_correcoes.sql` | Remoção de evidência com motivo e edição estrutural do gestor passam a entrar no histórico |
| `supabase/migrations/20261112120000_gestor_nas_secretarias.sql` | Gestor entra também por qualquer secretaria e atualiza o acompanhamento nela |
| `supabase/migrations/20261113120000_evidencias_no_historico.sql` | Cada registro do histórico aponta a evidência que anexou ou removeu (`evidencia_id`), para os anexos serem baixados pelo histórico |
| `supabase/migrations/20261114120000_conteudo_seed_der.sql` | Versão atualizada do relatório: ficha e acompanhamento das 7 ações da SEED, com registro no histórico, e resumo da aba Início e fonte das recomendações do DER |
| `supabase/functions/usuarios/index.ts` | Edge Function do cadastro de usuários e do primeiro gestor |
| `supabase/tests/regras_de_acesso.sql` | Testes das regras de acesso (rodam em transação e desfazem tudo) |
| `scripts/gera-conteudo-inicial.cjs` | Gera a migration da carga inicial a partir do HTML original (versão offline, fora do repositório) |

## Publicar no Lovable (Lovable Cloud)

1. Suba este repositório no GitHub e conecte-o a um projeto do Lovable com o **Lovable Cloud** ativado. O Cloud cria o banco e preenche `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
2. Aplique as migrations de `supabase/migrations/`, **na ordem do nome do arquivo**: o schema, o conteúdo e depois as seguintes. Pode pedir ao agente do Lovable ou colar no editor SQL do Cloud. Num projeto já publicado, aplique só as que ainda não rodaram.
3. Publique a Edge Function `usuarios` (`supabase/functions/usuarios`). Ela precisa de `verify_jwt = false`, como está em `supabase/config.toml`, porque confere o token por conta própria.
4. Nos *secrets* das Edge Functions, crie `SAEQG_BOOTSTRAP_TOKEN` com um valor longo e aleatório. `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já vêm do ambiente.
5. Em Auth, **desative o cadastro aberto** (*allow new users to sign up*). As contas são criadas só pela coordenação.
6. Crie o primeiro gestor da SEFA (veja abaixo). Depois disso, todos os demais usuários são cadastrados pela tela **Configurações > Cadastros**.

### Primeiro gestor (bootstrap)

A chamada só funciona enquanto não houver nenhum gestor cadastrado:

```bash
curl -X POST "https://<projeto>.supabase.co/functions/v1/usuarios" \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-token: <SAEQG_BOOTSTRAP_TOKEN>" \
  -d '{"acao":"bootstrap","email":"gestor@sefa.pr.gov.br","senha":"Senha@Forte1"}'
```

Depois do primeiro gestor, convém apagar o secret `SAEQG_BOOTSTRAP_TOKEN`.

## Rodar localmente

Requer o [Supabase CLI](https://supabase.com/docs/guides/local-development), Docker e Node 20 ou superior.

```bash
supabase start                      # sobe Postgres, Auth, Storage e Functions
supabase db reset                   # aplica as migrations (schema e conteúdo)
echo 'SAEQG_BOOTSTRAP_TOKEN=local' > supabase/functions/.env
supabase functions serve --env-file supabase/functions/.env
cp .env.example .env                # preencha com a URL e a anon key de "supabase status"
npm install
npm run dev                         # http://localhost:8080
```

Crie o gestor com o `curl` acima, usando `http://127.0.0.1:54321` e o token `local`.

## Testes

```bash
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/tests/regras_de_acesso.sql
```

São 61 verificações sobre o que anônimo, gestor e restrito podem ler e gravar, o histórico (inclusive remoção de evidência, edição estrutural e a evidência ligada a cada atualização), os anexos e o download deles, a numeração das ações, a recorrência, o arquivamento e a exclusão. Tudo roda numa transação desfeita no fim. Rode com a carga inicial intacta, logo depois de `supabase db reset`.

## Regras de acesso

| | Anônimo | Restrito (secretaria) | Gestor (SEFA) |
|---|---|---|---|
| Lista de órgãos da tela de acesso | sim | sim | sim |
| Entra por | — | secretarias liberadas no cadastro | SEFA e todas as secretarias, alternando pela barra lateral sem sair |
| Vê | — | estudos liberados, no ar e não apagados (arquivado: só consulta) | tudo, inclusive Apagados |
| Atualiza situação, progresso, justificativa e evidências | — | sim, em estudo no ar e não arquivado | sim, em estudo no ar e não arquivado (pela tela da secretaria) |
| Remove evidência (nome e motivo obrigatórios, registrado no histórico) | — | sim, em estudo no ar e não arquivado | sim, em qualquer estudo |
| Baixa os anexos das evidências, no cartão da ação e no histórico de atualizações | — | sim, nos estudos que vê (inclusive arquivado) | sim, em todos |
| Ficha e prazo pactuado das ações, cria ações | — | não | sim (edição estrutural, registrada no histórico) |
| Edita ou apaga o histórico | — | não | não (só sai junto com a ação, na exclusão definitiva) |
| Secretarias, estudos, recomendações, arquivar e apagar | — | não | sim |
| Usuários | — | não | sim (Edge Function) |

## API

### Leitura (tabelas com RLS)

`orgaos`, `estudos`, `recomendacoes`, `acoes`, `evidencias`, `anexos`, `historico`, `usuarios` e `usuario_acessos`. O front carrega tudo o que o usuário pode ver na entrada e a cada troca de tela (`carregaTudo` em `src/api.js`).

### Escrita (RPC: `supabase.rpc(nome, args)`)

| Função | Quem | O que faz |
|---|---|---|
| `orgaos_publicos()` | todos | Órgãos da tela de acesso, com `no_ar` |
| `verificar_acesso(p_orgao)` | logado | Confere se o usuário entra pelo órgão. Devolve `{ok, perfil, usuario}` ou `{ok:false, erro}` |
| `salvar_orgao(p_id, p_sigla, p_nome, p_orgao)` | gestor | Cria (`p_id` nulo) ou edita uma secretaria |
| `salvar_estudo(p_org, p_id, p_nome, p_programa, p_acao, p_resumo, p_focal_area, p_focal_pessoa, p_focal_email)` | gestor | Cria ou edita um estudo |
| `salvar_recomendacao(p_org, p_estudo, p_rid, p_titulo, p_chamada, p_icone, p_paragrafos)` | gestor | Cria (número automático) ou edita uma recomendação |
| `marcar_item(p_chave, p_campos)` | gestor | `apagado`, `arquivado` e, no estudo, `oculto`. Chave: `org\|o`, `pil\|o\|e`, `rec\|o\|e\|rid`, `aca\|o\|e\|cod` |
| `apagar_definitivo(p_chave)` | gestor | Exclui de vez um item que está em Apagados e devolve os anexos a remover do Storage |
| `criar_acao(p_org, p_estudo, p_rid, p_dados, p_prazo, p_recorrente)` | gestor | Cria a ação (ou uma por exercício até 2030) e devolve os códigos |
| `editar_acao(p_org, p_estudo, p_codigo, p_campos)` | gestor | Edição estrutural: ficha e prazo. O que mudou entra no histórico (tipo `coordenacao`) |
| `atualizar_acompanhamento(p_org, p_estudo, p_codigo, p_status, p_progresso, p_justificativa, p_autor, p_evidencia)` | restrito, gestor | Grava o acompanhamento e a evidência, e registra no histórico com data e hora do servidor, o e-mail do login e o id da evidência anexada (`evidencia_id`) |
| `remover_evidencia(p_id, p_motivo, p_autor)` | restrito, gestor | Remove a evidência, registra no histórico (tipo `remocao`) o motivo, o texto, os anexos removidos e o id da evidência, e devolve os anexos a remover do Storage |

### Edge Function `usuarios` (`POST /functions/v1/usuarios`)

- `{ "acao": "salvar", "id"?, "email", "senha"?, "nivel": "gestor"|"restrito", "acessos"?: { "<org>": ["<estudo>"] } }`
- `{ "acao": "excluir", "id" }`
- `{ "acao": "bootstrap", "email", "senha" }` com o header `x-bootstrap-token`

Valem as mesmas regras da tela: senha com 6 caracteres, uma maiúscula e um caractere especial; e-mail único; sempre ao menos um gestor; ninguém muda o próprio nível nem exclui a si mesmo.

### Storage

Bucket privado `evidencias`, com até 25 MB por arquivo. Caminho: `<org>/<estudo>/<código da ação>/<uuid>/<arquivo>`. Só envia quem pode atualizar o estudo, e só baixa quem pode vê-lo. O download usa link assinado de 1 minuto.

## O que mudou em relação ao HTML original

- **Login**: saiu o acesso pela sigla (`sesa`/`sesa`) e a entrada livre enquanto não havia cadastro, como o próprio código previa ("sai quando o servidor entrar"). Só entra quem está em Cadastros.
- **Sessão**: fica no `sessionStorage` da aba, como antes. Fechar a aba encerra o acesso.
- **Anexos**: os arquivos das evidências passam a ser enviados e podem ser baixados clicando no nome. Anexo sem texto de evidência é recusado, para não se perder.
- **Histórico**: data, hora e e-mail vêm do servidor, e não do navegador.
- **Conteúdo dos relatórios**: saiu do código e virou carga inicial do banco. O HTML original (versão offline) fica fora deste repositório; a carga inicial foi gerada dele com:

```bash
node scripts/gera-conteudo-inicial.cjs "<caminho do HTML offline>" > supabase/migrations/<timestamp>_conteudo.sql
```

A carga é idempotente (`on conflict do nothing`): não sobrescreve o que já está no banco. Para levar ao sistema um texto que mudou depois, edite pela tela de Configurações ou escreva uma migration de atualização, como a `20261114120000_conteudo_seed_der.sql`.

Dados que estavam no `localStorage` de algum navegador **não são migrados**. A versão final já começava sem lançamentos.
