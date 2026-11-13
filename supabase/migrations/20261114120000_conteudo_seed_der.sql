-- SAEQG · versão atualizada do relatório: ações da SEED e aba Início do DER
--
-- Fonte: a versão offline do sistema (HTML "vFinal") de 12/11/2026, que fica
-- fora deste repositório. Esta migration leva ao banco o que mudou nela
-- depois da carga inicial (20261110120100_conteudo_inicial.sql), que não
-- sobrescreve linhas que já existem.
--
-- SEED (Educação) · as 7 ações (1.1, 2.1, 3.1, 4.1, 5.1, 5.2, 5.3)
--   Ficha: título, descrição, responsável, área, pessoa, produto e resultado
--   da versão offline, com três correções combinadas com a coordenação:
--     1.1  a descrição repetia o texto do produto; passa a descrever a ação,
--          no mesmo molde da 2.1;
--     2.1  o resultado repetia o da 1.1 e falava em água; passa a falar em
--          energia elétrica;
--     4.1  "manuntenção" corrigido para "manutenção" no responsável.
--   Acompanhamento: situação, prazo pactuado, progresso e justificativa
--   informados pela SEED antes do sistema.
--   Vale a carga: os valores entram mesmo onde já houver lançamento no
--   sistema. Nada sai do histórico, e cada ação ganha até dois registros:
--     "Edição pela coordenação" (tipo coordenacao) com a ficha e o prazo, e
--     "Atualização" (tipo edicao) com situação, progresso e justificativa,
--   este em nome da SEED, porque é ele que o painel da coordenação conta como
--   acompanhamento da secretaria. Só entra registro do que de fato mudou, e
--   por isso rodar esta migration de novo não muda nada.
--
-- DER (Estradas de Rodagem)
--   Aba Início: o resumo passa a ser o da versão offline (mudam os blocos
--   "Do que se trata" e "O que foi analisado").
--   Recomendações 1, 2 e 3: o campo fonte fica vazio, e a linha de fonte sai
--   da aba Recomendações. Estudo e recomendação não têm histórico.

-- ---------------------------------------------------------------- SEED

do $$
declare
  c record;
  a public.acoes;
  f record;
  v_mud jsonb;
  v_prog_antes text;
  v_janela jsonb;
  v_em timestamptz;
begin
  for c in
    select * from (values
      ('1.1', 'Validação e racionalização do consumo de água das unidades escolares classificadas no quarto quartil', 'Realizar análise técnica das unidades escolares classificadas no quarto quartil de consumo de água em seus respectivos agrupamentos, com vistas à validação dos dados utilizados no estudo, identificação dos principais fatores associados ao consumo elevado e implementação de medidas corretivas e de racionalização quando tecnicamente cabíveis.', 'SEED, Núcleos Regionais de Educação, Direções Escolares e áreas responsáveis por infraestrutura e manutenção predial',
       'SEED/DG/UTGI/CSS', 'Coordenador CSS', 'Relatório consolidado contendo: validação das unidades consumidoras analisadas; identificação de consumos atípicos; diagnóstico das principais causas dos consumos elevados; proposição de medidas corretivas e de racionalização.', 'Aprimoramento da gestão do consumo de água nas unidades escolares, mediante identificação e tratamento de inconsistências cadastrais, operacionais e estruturais que contribuam para desvios em relação ao padrão de escolas comparáveis.',
       date '2027-12-31', 'em_execucao', 1, 'O potencial de economia estimado no estudo depende de validação individualizada das unidades escolares classificadas no quarto quartil em comparação com o agrupamento total das mais de 2.000 unidades relacionadas, considerando fatores estruturais, operacionais, cadastrais e pedagógicos que podem influenciar o consumo de água. A ação busca qualificar a análise dos dados e direcionar intervenções com potencial efetivo de racionalização.'),
      ('2.1', 'Validação e racionalização do consumo de energia elétrica das unidades escolares classificadas no quarto quartil', 'Realizar análise técnica das unidades escolares classificadas no quarto quartil de consumo de energia elétrica em seus respectivos agrupamentos, com vistas à validação dos dados utilizados no estudo, identificação dos principais fatores associados ao consumo elevado e implementação de medidas de racionalização e eficiência energética quando tecnicamente cabíveis.', 'SEED, Núcleos Regionais de Educação, Direções Escolares e áreas responsáveis por infraestrutura e manutenção predial',
       'SEED/DG/UTGI/CSS', 'Coordenador CSS', 'Relatório consolidado contendo: validação das unidades consumidoras analisadas; identificação de consumos atípicos; diagnóstico das principais causas dos consumos elevados; proposição de medidas corretivas e de racionalização.', 'Aprimoramento da gestão do consumo de energia elétrica nas unidades escolares, mediante identificação e tratamento de inconsistências cadastrais, operacionais e estruturais que contribuam para desvios em relação ao padrão de escolas comparáveis.',
       date '2027-12-31', 'em_execucao', 1, 'O potencial de economia estimado no estudo depende de validação individualizada das unidades escolares classificadas no quarto quartil, considerando fatores estruturais, operacionais, cadastrais e pedagógicos que podem influenciar o consumo de água. A ação busca qualificar a análise dos dados e direcionar intervenções com potencial efetivo de racionalização.'),
      ('3.1', 'Diagnóstico e verificação das unidades escolares com consumo atípico de água', 'Realizar diagnóstico das unidades escolares identificadas no estudo com consumo de água significativamente superior aos parâmetros observados em escolas comparáveis, visando verificar a consistência dos dados utilizados, identificar fatores que contribuam para o consumo elevado e adotar medidas corretivas quando aplicáveis.', 'SEED e Núcleos Regionais de Educação, Direções Escolares e áreas responsáveis por infraestrutura predial',
       'SEED/DG/UTGI/CSS', 'Coordenador CSS', 'Relação validada das unidades classificadas como atípicas. Diagnóstico das condições de consumo das unidades analisadas. Identificação de possíveis inconsistências cadastrais, operacionais ou de medição. Relatório consolidado com recomendações de tratamento para cada situação identificada.', 'Qualificar a gestão das despesas com abastecimento de água mediante a identificação de fatores que ocasionem consumos atípicos, permitindo a correção de inconsistências cadastrais, operacionais ou estruturais e subsidiando ações de racionalização quando cabíveis.',
       date '2027-12-31', 'nao_iniciada', 0, 'O estudo identificou unidades escolares com consumo de água significativamente superior ao padrão observado em escolas comparáveis. Considerando que tais ocorrências podem decorrer de fatores diversos, como vazamentos, falhas de medição, inconsistências cadastrais, características específicas da unidade ou outras condições operacionais, torna-se necessária a realização de análise individualizada para subsidiar a adoção de medidas adequadas.'),
      ('4.1', 'Auditoria cadastral e validação das unidades escolares com consumo atípico de água e energia elétrica', 'Realizar auditoria cadastral e análise das unidades escolares identificadas no estudo com consumo de água ou energia elétrica significativamente inferior aos parâmetros observados em escolas comparáveis, visando verificar a consistência das informações, identificar possíveis situações de sub-registro, abastecimento ou geração própria, faturamento vinculado a outra unidade consumidora e demais inconsistências que possam impactar a qualidade dos dados utilizados na gestão.', 'SEED e Núcleos Regionais de Educação, Direções Escolares e área responsável pela infraestrutura e manutenção predial',
       'SEED/DG/UTGI/CSS', 'Coordenador CSS', 'Relação validada das unidades classificadas com consumo atípico baixo; Relatório de auditoria cadastral das unidades analisadas; Identificação de inconsistências de cadastro, faturamento ou medição; Registro das medidas corretivas propostas ou adotadas.', 'Aprimorar a confiabilidade das bases de dados de consumo de água e energia elétrica da Rede Pública Estadual de Ensino, permitindo maior precisão nas análises gerenciais, nos estudos comparativos e no direcionamento das ações de racionalização de despesas.',
       date '2027-12-31', 'nao_iniciada', 0, 'O estudo identificou unidades escolares com consumo de água ou energia elétrica incompatível com o porte e as características operacionais observadas em escolas semelhantes. Tais situações podem decorrer de abastecimento ou geração própria, inconsistências cadastrais, faturamento vinculado a outra unidade consumidora ou falhas de medição. A validação dessas informações é necessária para assegurar a qualidade dos dados utilizados nos processos de monitoramento e tomada de decisão.'),
      ('5.1', 'Implantação e monitoramento de indicadores de consumo e gasto por aluno por cluster', 'Estruturar e acompanhar indicadores de consumo e gasto com água e energia elétrica por aluno, observando os agrupamentos (clusters) definidos no estudo, de forma a subsidiar o monitoramento das unidades escolares, a identificação de desvios relevantes e o apoio à tomada de decisão gerencial.', 'SEED e Núcleos Regionais de educação',
       'SEED/DG/UTGI/CSS', 'Coordenador CSS', 'Indicadores de consumo e gasto por aluno definidos e documentados; Painel gerencial ou relatórios periódicos de acompanhamento; Consolidação dos parâmetros de referência por cluster; Monitoramento periódico das unidades escolares.', 'Disponibilizar informações comparáveis e padronizadas que permitam acompanhar o comportamento do consumo e das despesas de água e energia elétrica, apoiando a priorização de análises e ações de gestão.',
       date '2027-12-31', 'nao_iniciada', 0, 'O estudo utilizou o gasto por aluno por mês como indicador central para comparação entre escolas de características semelhantes. A institucionalização desse monitoramento permitirá o acompanhamento contínuo dos desvios observados e subsidiará a gestão das despesas de custeio das unidades escolares.'),
      ('5.2', 'Identificação e disseminação de práticas de gestão eficiente do consumo de água e energia', 'Identificar unidades escolares que apresentem desempenho de destaque em seus respectivos agrupamentos e consolidar práticas, procedimentos e iniciativas que possam contribuir para o uso eficiente de água e energia, promovendo sua disseminação junto aos Núcleos Regionais de Educação e unidades escolares da rede.', 'SEED e Núcleos Regionais de Educação',
       'SEED/DG/UTGI/CSS', 'Coordenador CSS', 'Levantamento das unidades de referência identificadas pelo estudo; Relatório consolidado de boas práticas; Materiais orientativos para divulgação junto aos NREs e unidades escolares; Registros das ações de compartilhamento realizadas.', 'Promover a disseminação de práticas de gestão que contribuam para a utilização eficiente de água e energia elétrica nas unidades escolares, fortalecendo a cultura de uso racional dos recursos públicos.',
       date '2027-12-31', 'nao_iniciada', 0, 'O estudo identificou unidades escolares com desempenho significativamente superior ao observado em escolas comparáveis. O compartilhamento das práticas adotadas por essas unidades poderá subsidiar ações de melhoria e racionalização em outras escolas da rede.'),
      ('5.3', 'Monitoramento físico-financeiro das despesas de água e energia vinculadas à Ação Orçamentária 8470', 'Realizar o acompanhamento sistemático da execução física e financeira das despesas de água e energia elétrica custeadas pela Ação Orçamentária 8470, consolidando informações gerenciais que subsidiem o planejamento, a alocação de recursos e a avaliação dos resultados obtidos.', 'SEED (Núcleo Fazendário Setorial)',
       'SEED/DG/UTGI/CSS', 'Coordenador CSS', 'Relatórios periódicos de execução física e financeira; Consolidação de informações orçamentárias e de consumo; Painéis gerenciais de acompanhamento; Subsídios técnicos para planejamento orçamentário e financeiro.', 'Fortalecer a governança e a gestão das despesas de água e energia elétrica da Rede Pública Estadual de Ensino, ampliando a capacidade de monitoramento, planejamento e tomada de decisão baseada em evidências.',
       date '2027-12-31', 'nao_iniciada', 0, 'O acompanhamento estruturado da execução físico-financeira das despesas custeadas pela Ação Orçamentária 8470 contribui para a melhoria da gestão dos recursos públicos, permitindo maior visibilidade sobre a aplicação dos recursos, a evolução dos consumos e os resultados alcançados pelas ações de racionalização e monitoramento implementadas.')
    ) as x(codigo, titulo, descricao, responsavel, area, pessoa, produto, resultado,
           prazo, status, progresso, justificativa)
  loop
    select * into a from public.acoes
     where org_id = 'seed' and estudo_id = 'p1' and codigo = c.codigo for update;
    if a.codigo is null then
      raise notice 'SEED %: ação não encontrada, ficou de fora.', c.codigo;
      continue;
    end if;

    -- 1. Ficha e prazo pactuado: "Edição pela coordenação" (rótulos de editar_acao)
    v_em := '-infinity';
    v_mud := '[]'::jsonb;
    for f in select * from (values
        ('titulo',      'Título da ação',                 a.titulo,      c.titulo),
        ('descricao',   'Descrição',                      a.descricao,   c.descricao),
        ('responsavel', 'Responsável (unidade ou órgão)', a.responsavel, c.responsavel),
        ('area',        'Área responsável',               a.area,        c.area),
        ('pessoa',      'Pessoa responsável',             a.pessoa,      c.pessoa),
        ('produto',     'Produto esperado',               a.produto,     c.produto),
        ('resultado',   'Resultado esperado',             a.resultado,   c.resultado),
        ('prazo',       'Prazo pactuado',                 a.prazo::text, c.prazo::text)) as y(campo, rotulo, de, para)
    loop
      if coalesce(f.de, '') <> coalesce(f.para, '') then
        v_mud := v_mud || jsonb_build_object('campo', f.campo, 'rotulo', f.rotulo,
                                             'de', coalesce(f.de, ''), 'para', coalesce(f.para, ''));
      end if;
    end loop;
    if jsonb_array_length(v_mud) > 0 then
      update public.acoes
         set titulo = c.titulo, descricao = c.descricao, responsavel = c.responsavel, area = c.area,
             pessoa = c.pessoa, produto = c.produto, resultado = c.resultado, prazo = c.prazo,
             atualizado_em = now()
       where org_id = 'seed' and estudo_id = 'p1' and codigo = c.codigo
      returning * into a;
      v_janela := jsonb_build_object(
        'titulo', a.titulo, 'descricao', a.descricao, 'responsavel', a.responsavel,
        'area', a.area, 'pessoa', a.pessoa, 'produto', a.produto, 'resultado', a.resultado,
        'status', a.status, 'prazo', coalesce(a.prazo::text, ''),
        'progresso', coalesce(a.progresso, case when a.status = 'concluida' then 100 else 0 end)::text,
        'justificativa', coalesce(a.justificativa, ''));
      v_em := clock_timestamp();
      insert into public.historico (org_id, estudo_id, codigo, em, tipo, autor, email, campos, mudancas)
      values ('seed', 'p1', c.codigo, v_em, 'coordenacao',
              'Coordenação (SEFA) · versão atualizada do relatório', '', v_janela, v_mud);
    end if;

    -- 2. Acompanhamento: "Atualização" (rótulos de atualizar_acompanhamento)
    v_mud := '[]'::jsonb;
    v_prog_antes := coalesce(a.progresso, case when a.status = 'concluida' then 100 else 0 end)::text;
    if a.status <> c.status then
      v_mud := v_mud || jsonb_build_object('campo', 'status', 'rotulo', 'Situação', 'de', a.status, 'para', c.status);
    end if;
    if v_prog_antes <> c.progresso::text then
      v_mud := v_mud || jsonb_build_object('campo', 'progresso', 'rotulo', 'Progresso', 'de', v_prog_antes,
                                           'para', c.progresso::text);
    end if;
    if coalesce(a.justificativa, '') <> c.justificativa then
      v_mud := v_mud || jsonb_build_object('campo', 'justificativa', 'rotulo', 'Justificativa',
                                           'de', coalesce(a.justificativa, ''), 'para', c.justificativa);
    end if;
    if jsonb_array_length(v_mud) > 0 then
      update public.acoes
         set status = c.status, progresso = c.progresso, justificativa = c.justificativa, atualizado_em = now()
       where org_id = 'seed' and estudo_id = 'p1' and codigo = c.codigo
      returning * into a;
      v_janela := jsonb_build_object(
        'titulo', a.titulo, 'descricao', a.descricao, 'responsavel', a.responsavel,
        'area', a.area, 'pessoa', a.pessoa, 'produto', a.produto, 'resultado', a.resultado,
        'status', a.status, 'prazo', coalesce(a.prazo::text, ''), 'progresso', a.progresso::text,
        'justificativa', a.justificativa);
      insert into public.historico (org_id, estudo_id, codigo, em, tipo, autor, email, campos, mudancas)
      -- sempre depois da edição da coordenação, para a ordem do histórico não depender do relógio
      values ('seed', 'p1', c.codigo, greatest(clock_timestamp(), v_em + interval '1 millisecond'), 'edicao',
              'SEED (informado antes do sistema, lançado pela coordenação)', '', v_janela, v_mud);
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------- DER

update public.estudos
   set resumo = '[["Do que se trata","Estudo da Qualidade do Gasto do programa Orçamento para Resultados, aplicado à gestão da manutenção rodoviária no âmbito da Ação 8398, maior ação orçamentária do DER, com R$ 1,19 bilhão em 2025. A análise concentrou-se nos 46 contratos de manutenção e conservação de pavimentos das cinco Superintendências Regionais, que somaram cerca de R$ 869,5 milhões liquidados, 72,8% do total liquidado da ação. O plano de ação do relatório tem caráter preliminar e deverá ser detalhado e pactuado com o DER na etapa de formalização dos encaminhamentos finais."],["Objetivo da análise","Verificar como a intensidade do gasto nos contratos de manutenção e conservação de pavimentos se relaciona com a condição observada da malha em cada Superintendência Regional, e em que medida a distribuição dos recursos se mostra aderente à criticidade técnica identificada, sem atribuir relação causal entre gasto e condição."],["O que foi analisado","Quatro dimensões comparadas entre as cinco Superintendências Regionais: intensidade do gasto, medida pelo valor liquidado por quilômetro de extensão contratada; condição observada da malha, pelo levantamento SAM 2025 e pelos indicadores de irregularidade superficial e de capacidade estrutural do pavimento de 2021 e 2022; aderência alocativa; e sinais de pressão futura. O estudo resultou no Painel de Execução e Condição da Malha, organizado em cinco abas: Diagnóstico da Malha, Pressão e Execução, Leitura Regional, Sinais e Benchmark CNT."],["Resultado esperado","Incorporar o painel como instrumento permanente de monitoramento na gestão orçamentária do DER, apoiando a identificação de regionais e contratos que demandem análise técnica adicional, sem que seja usado como critério automático de corte ou redistribuição de recursos entre regionais."]]'::jsonb
 where org_id = 'der' and id = 'p1';

update public.recomendacoes
   set fonte = null
 where org_id = 'der' and estudo_id = 'p1' and rid in ('r1', 'r2', 'r3');
