// The lab's source of truth: runs every L case through the 6.0.3 release, the lab build and Node, and prints a
// markdown matrix of where each rule stands. Exits 1 if any case is broken or any control fails.
//
//   node L/tracker.mjs [rule ...]          default: every rule
//
// Each rule is a folder, L/<rule>/, holding its rule.txt and its cases. rule.txt is the rule's proof: its obligations,
// each with the L code its mechanism reports, cite every case they rest on, and the tracker holds the folder to the
// proof (see rules.mjs). A case's first line says what it is for:
// `// witness:`, `// control:` or `// rejected sound code:`. A marked line names the diagnostic its mechanism emits,
// `// rejected here: TS2890`, optionally followed by text that diagnostic's chain must contain. A rejection only counts
// when a diagnostic on that line carries both.
//
// Cases are judged under L's catalog options: strict, noUncheckedIndexedAccess and exactOptionalPropertyTypes.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, sep } from 'node:path';
import { KINDS, readRules } from './rules.mjs';

const lab = import.meta.dirname;
const repo = join(lab, '..');
const RELEASE = join(repo, 'lib/typescript.js');
const LAB = join(repo, 'built/local/typescript.js');
const MARK = /\/\/ rejected here(?:: TS(\d+)(?: (.*\S))?)?\s*$/;
const ROLE = /^\/\/ (witness|control|rejected sound code): /;
const KIND_OF_ROLE = { witness: 'witness', control: 'control', 'rejected sound code': 'sound' };
const ROLE_NAME = { witness: 'a witness', control: 'a control', sound: 'rejected sound code' };
const wanted = process.argv.slice(2);

if (!existsSync(LAB)) {
  console.error('No lab build at built/local/typescript.js: run `npx hereby local` first.');
  process.exit(2);
}

const rules = readRules(lab).filter((r) => wanted.length === 0 || wanted.includes(r.name))
  .sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind) || a.name.localeCompare(b.name));

// Every case, with the role its first line gives it.
const cases = rules.flatMap((rule) => readdirSync(rule.dir).filter((n) => n.endsWith('.ts')).sort().map((n) => {
  const file = join(rule.dir, n);
  const role = ROLE.exec(readFileSync(file, 'utf8'))?.[1];
  return { rule, file, kind: role === undefined ? undefined : KIND_OF_ROLE[role] };
}));

// The diagnostics one compiler gives every case, by file: each with its line and its whole chain, flattened. Each case
// is a module, so one program holds them all without one case seeing another.
function diagnose(path) {
  const ts = createRequire(import.meta.url)(path);
  const program = ts.createProgram(cases.map((c) => c.file), {
    strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: true, types: [],
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleDetection: ts.ModuleDetectionKind.Force,
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
  });
  const flatten = (m) => [{ code: m.code, text: m.messageText }, ...(m.next ?? []).flatMap(flatten)];
  const byFile = new Map(cases.map((c) => [c.file, []]));
  const global = [];
  for (const d of ts.getPreEmitDiagnostics(program)) {
    const chain = typeof d.messageText === 'string' ? [{ code: d.code, text: d.messageText }] : flatten(d.messageText);
    const found = d.file && byFile.get(d.file.fileName);
    if (found) found.push({ line: d.file.getLineAndCharacterOfPosition(d.start).line + 1, chain });
    else global.push(`TS${chain[0].code}: ${chain[0].text}`);
  }
  return { byFile, global };
}

const release = diagnose(RELEASE);
const built = diagnose(LAB);
const lines = (ds) => [...new Set(ds.map((d) => d.line))].sort((a, b) => a - b);
const head = (d) => `TS${d.chain[0].code}: ${d.chain[0].text}`;
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const description = (text) => text.split('\n').filter((l) => l.startsWith('//')).map((l) => l.replace(ROLE, '').replace(/^\/\/ ?/, '')).join(' ').replace(/\s+/g, ' ');

// One case: where it stands, and why when it is broken.
function judge(c) {
  const text = readFileSync(c.file, 'utf8');
  const marks = text.split('\n').flatMap((l, i) => {
    const m = MARK.exec(l);
    return m ? [{ line: i + 1, code: m[1] === undefined ? undefined : Number(m[1]), fragment: m[2] }] : [];
  });
  const accepted = release.byFile.get(c.file);
  const got = built.byFile.get(c.file);
  const run = spawnSync(process.execPath, [c.file], { encoding: 'utf8', timeout: 10_000 });
  const threw = run.status !== 0;
  const problems = [];
  if (c.kind === undefined) problems.push('the first line doesn\'t say whether it is a witness, a control or rejected sound code');
  if (accepted.length) problems.push(`the release rejects line ${lines(accepted).join(', ')}: ${head(accepted[0])}`);
  if (c.kind === 'witness' && !(threw && /TypeError|ReferenceError/.test(run.stderr))) problems.push('Node does not throw a TypeError or ReferenceError');
  if (c.kind !== 'witness' && threw) problems.push(`Node throws: ${run.stderr.split('\n').find((l) => /Error/.test(l)) ?? run.stderr.trim()}`);
  if (c.kind === 'control' && marks.length) problems.push('a control marks a line to reject');
  for (const m of marks.filter((m) => m.code === undefined)) problems.push(`line ${m.line} is marked without the diagnostic its mechanism emits`);
  // rule.txt cites the case under each obligation it supports, in the role the case's first line claims. A marker
  // names the code of an obligation that cites the case, and a rejection cited under an obligation marks its code.
  const base = c.file.split(sep).pop();
  const citing = c.rule.mechanisms.filter((o) => o.cites.some((x) => x.file === base));
  if (citing.length === 0) problems.push('rule.txt doesn\'t cite this case under any obligation');
  for (const o of citing) {
    const role = o.cites.find((x) => x.file === base).role;
    if (c.kind !== undefined && role !== c.kind) problems.push(`rule.txt cites it as ${ROLE_NAME[role]} under obligation ${o.number}, but its first line says ${ROLE_NAME[c.kind]}`);
    if (role !== 'control' && !marks.some((m) => m.code === o.code)) problems.push(`rule.txt cites it under obligation ${o.number}, TS${o.code}, but no line is marked TS${o.code}`);
  }
  for (const m of citing.length ? marks.filter((m) => m.code !== undefined && !citing.some((o) => o.code === m.code)) : []) {
    problems.push(`line ${m.line} is marked TS${m.code}, but rule.txt cites it only under ${citing.map((o) => `obligation ${o.number}, TS${o.code}`).join(' and ')}`);
  }
  let status;
  if (problems.length) status = 'broken';
  else if (c.kind === 'control') status = got.length ? 'failing' : 'passing';
  else if (marks.length === 0) {
    status = c.kind === 'witness' && got.length === 0 ? 'open' : 'broken';
    if (status === 'broken') problems.push(got.length ? `the lab rejects line ${lines(got).join(', ')}, but no line is marked: ${head(got[0])}` : 'no line is marked');
  }
  else {
    if (!same(lines(got), marks.map((m) => m.line))) {
      problems.push(`the lab rejects line${lines(got).length === 1 ? '' : 's'} [${lines(got).join(', ')}], marked [${marks.map((m) => m.line).join(', ')}]`);
    }
    for (const m of marks) {
      const here = got.filter((d) => d.line === m.line);
      const through = here.some((d) => d.chain.some((x) => x.code === m.code) && (m.fragment === undefined || d.chain.some((x) => x.text.includes(m.fragment))));
      if (here.length && !through) {
        const codes = [...new Set(here.flatMap((d) => d.chain.map((x) => `TS${x.code}`)))].join(', ');
        problems.push(`line ${m.line} is rejected for another reason: its chain has ${codes}, not TS${m.code}${m.fragment ? ` with "${m.fragment}"` : ''}`);
      }
    }
    status = problems.length ? 'broken' : c.kind === 'witness' ? 'closed' : 'rejected as designed';
  }
  return {
    ...c, status, problems, lab: got,
    name: relative(lab, c.file).split(sep).join('/'),
    about: description(text),
    mechanism: [...new Set(marks.map((m) => `TS${m.code}`))].join(', '),
  };
}

const judged = cases.map(judge);
const of = (r) => judged.filter((c) => c.rule === r);
const count = (r, kind, status) => of(r).filter((c) => c.kind === kind && (status === undefined || c.status === status)).length;
const standing = (r) => {
  if (r.problems.length) return 'broken';
  if (of(r).length === 0) return 'spec only';
  if (of(r).some((c) => c.status === 'broken')) return 'broken';
  if (of(r).some((c) => c.status === 'failing')) return 'false positives';
  if (of(r).some((c) => c.status === 'open')) return 'holes open';
  return 'sound';
};

const out = ['# L lab: where each rule stands', ''];
for (const g of [...release.global.map((d) => `the release: ${d}`), ...built.global.map((d) => `the lab: ${d}`)]) out.push(`Program diagnostic from ${g}`, '');
out.push('| Kind | Rule | Mechanisms | Standing | Witnesses closed | Witnesses open | Controls passing | Controls failing | Rejected as designed | Broken |');
out.push('|---|---|---|---|---|---|---|---|---|---|');
for (const r of rules) {
  out.push(`| ${r.kind} | ${r.name} | ${r.mechanisms.map((m) => `TS${m.code}`).join(', ')} | ${standing(r)} | ${count(r, 'witness', 'closed')}/${count(r, 'witness')} | ` +
    `${count(r, 'witness', 'open')} | ${count(r, 'control', 'passing')}/${count(r, 'control')} | ${count(r, 'control', 'failing')} | ` +
    `${count(r, 'sound', 'rejected as designed')} | ${of(r).filter((c) => c.status === 'broken').length} |`);
}
for (const kind of KINDS) {
  if (wanted.length === 0 && !rules.some((r) => r.kind === kind)) out.push(`| ${kind} | (no rules filed yet) | | | | | | | | |`);
}
// debt.txt files each item under a rule's name, lab or L-hooks, so a heading that names no rule is stale.
const debt = existsSync(join(lab, 'debt.txt')) ? readFileSync(join(lab, 'debt.txt'), 'utf8').split('\n') : [];
const staleDebt = debt.filter((l) => /^[A-Za-z][A-Za-z-]*$/.test(l) && l !== 'lab' && l !== 'L-hooks' && !readRules(lab).some((r) => r.name === l));
for (const heading of staleDebt) out.push(`debt.txt files items under ${heading}, which isn't a rule`, '');
const broken = rules.filter((r) => r.problems.length);
if (broken.length) {
  out.push('', '## Rules with a broken rule.txt', '');
  for (const r of broken) out.push(`- \`${r.name}/rule.txt\`: ${r.problems.join('; ')}`);
}
const section = (title, status, detail) => {
  const listed = judged.filter((c) => c.status === status);
  if (!listed.length) return;
  out.push('', `## ${title}`, '');
  for (const c of listed) out.push(`- \`${c.name}\`${detail(c)}`);
};
section('Broken cases', 'broken', (c) => `: ${c.problems.join('; ')}`);
section('Controls the lab rejects (false positives)', 'failing', (c) => `: ${c.about} The lab says: ${head(c.lab[0])}`);
section('Holes still open', 'open', (c) => `: ${c.about}`);
section('Witnesses closed', 'closed', (c) => ` (${c.mechanism}): ${c.about}`);
section('Rejected as designed', 'rejected as designed', (c) => ` (${c.mechanism}): ${c.about}`);
console.log(out.join('\n'));
const fails = release.global.length || built.global.length || broken.length || staleDebt.length || judged.some((c) => c.status === 'broken' || c.status === 'failing');
process.exit(fails ? 1 : 0);
