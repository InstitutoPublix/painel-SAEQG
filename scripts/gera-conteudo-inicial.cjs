#!/usr/bin/env node
/* Gera a migration com o conteúdo dos relatórios finais (órgãos, estudos,
   recomendações e ações) a partir das constantes PERFIS e CONTEUDO do HTML
   original, a versão offline do sistema, que fica fora deste repositório:

     node scripts/gera-conteudo-inicial.cjs "<caminho do HTML offline>" \
       > supabase/migrations/20261110120100_conteudo_inicial.sql

   A carga é idempotente (on conflict do nothing): não sobrescreve nada que já
   esteja no banco. Texto que mudou depois da carga vai ao sistema pela tela
   de Configurações ou por uma migration de atualização, como a
   20261114120000_conteudo_seed_der.sql. */
const fs = require('fs');

const arquivo = process.argv[2];
if (!arquivo) { console.error('Uso: gera-conteudo-inicial.cjs <arquivo.html>'); process.exit(1); }

const html = fs.readFileSync(arquivo, 'utf8').replace(/\r\n/g, '\n');
const ini = html.indexOf('const PERFIS = [');
const fim = html.indexOf('/* ============================================================\n   2b.');
if (ini < 0 || fim < 0) throw new Error('Blocos PERFIS/CONTEUDO não encontrados no HTML');
const { PERFIS, CONTEUDO } = new Function(html.slice(ini, fim) + '\nreturn { PERFIS, CONTEUDO };')();

const lit = v => (v === null || v === undefined) ? 'null' : "'" + String(v).replace(/'/g, "''") + "'";
const json = v => lit(JSON.stringify(v)) + '::jsonb';
const int = v => (v === null || v === undefined || v === '') ? 'null' : String(parseInt(v, 10));

const out = [];
out.push('-- Conteúdo dos relatórios finais dos Estudos da Qualidade do Gasto.');
out.push('-- Gerado por scripts/gera-conteudo-inicial.cjs a partir do HTML original. Não editar à mão.');
out.push('');

out.push('insert into public.orgaos (id, sigla, nome, orgao, tipo, do_relatorio, ordem) values');
out.push(PERFIS.map((p, i) =>
  `  (${lit(p.id)}, ${lit(p.sigla)}, ${lit(p.nome)}, ${lit(p.orgao)}, ${lit(p.tipo)}, true, ${i + 1})`
).join(',\n') + '\non conflict (id) do nothing;\n');

const estudos = [], recs = [], acoes = [];
Object.keys(CONTEUDO).forEach(org => {
  const c = CONTEUDO[org], p = c.piloto;
  estudos.push(`  (${lit(org)}, 'p1', ${lit(p.programa)}, ${lit(p.programa)}, ${lit(p.acao || '')}, ` +
    `${json(p.resumo || [])}, ${lit(c.rotuloBloco)}, ${lit(c.rotuloPlural)}, ` +
    `${lit(p.focalArea || '')}, ${lit(p.focalPessoa || '')}, ${lit(p.focalEmail || '')}, true, 1)`);
  c.recomendacoes.forEach(r => {
    const rid = 'r' + r.numero;
    recs.push(`  (${lit(org)}, 'p1', ${lit(rid)}, ${int(r.numero)}, ${lit(r.titulo)}, ${lit(r.chamada || '')}, ` +
      `${lit(r.icone || 'lista')}, ${lit(r.cor)}, ${lit(r.fonte)}, ${lit(r.quadro)}, ${json(r.paragrafos || [])}, true)`);
    (r.acoes || []).forEach((a, k) => {
      acoes.push(`  (${lit(org)}, 'p1', ${lit(a.codigo)}, ${lit(rid)}, ${k + 1}, ${lit(a.titulo || '')}, ` +
        `${lit(a.descricao || '')}, ${lit(a.responsavel || '')}, ${lit(a.area || '')}, ${lit(a.pessoa || '')}, ` +
        `${lit(a.produto || '')}, ${lit(a.resultado || '')}, ${lit(a.horizonte)}, ${lit(a.horizonteOriginal)}, ` +
        `${lit(a.natureza || null)}, ${int(a.ciclo)}, 'relatorio', ${lit(a.status || 'nao_iniciada')})`);
    });
  });
});

out.push('insert into public.estudos (org_id, id, nome, programa, acao, resumo, rotulo_bloco, rotulo_plural,');
out.push('                            focal_area, focal_pessoa, focal_email, do_relatorio, ordem) values');
out.push(estudos.join(',\n') + '\non conflict (org_id, id) do nothing;\n');

out.push('insert into public.recomendacoes (org_id, estudo_id, rid, numero, titulo, chamada, icone, cor, fonte,');
out.push('                                  quadro, paragrafos, do_relatorio) values');
out.push(recs.join(',\n') + '\non conflict (org_id, estudo_id, rid) do nothing;\n');

out.push('insert into public.acoes (org_id, estudo_id, codigo, rid, ordem, titulo, descricao, responsavel, area,');
out.push('                          pessoa, produto, resultado, horizonte, horizonte_original, natureza, ciclo,');
out.push('                          origem, status) values');
out.push(acoes.join(',\n') + '\non conflict (org_id, estudo_id, codigo) do nothing;');

process.stdout.write(out.join('\n') + '\n');
console.error(`orgaos: ${PERFIS.length} · estudos: ${estudos.length} · recomendacoes: ${recs.length} · acoes: ${acoes.length}`);
