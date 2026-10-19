// The lab's source of truth: runs every L case through the 6.0.3 release, the lab build and Node, and prints a
// markdown matrix of where each rule stands. Exits 1 if any case is broken or any control fails.
//
//   node L/tracker.mjs [type ...]          default: soundness policy information project
//
// The hierarchy is L/<type>/<rule-label>/..., and a case's place in it says what it must do. A
// marked line names the diagnostic its mechanism emits, `// rejected here: TS2890`, optionally followed by text that
// diagnostic's chain must contain. A rejection only counts when a diagnostic on that line carries both, so a case
// rejected for some other reason is broken, not closed.
//
// Cases are judged under L's catalog options: strict, noUncheckedIndexedAccess and exactOptionalPropertyTypes.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative, sep } from 'node:path';

const lab = import.meta.dirname;
const repo = join(lab, '..');
const RELEASE = join(repo, 'lib/typescript.js');
const LAB = join(repo, 'built/local/typescript.js');
const MARK = /\/\/ rejected here(?:: TS(\d+)(?: (.*\S))?)?\s*$/;
const TYPES = process.argv.length > 2 ? process.argv.slice(2) : ['soundness', 'policy', 'information', 'project'];

if (!existsSync(LAB)) {
  console.error('No lab build at built/local/typescript.js: run `npx hereby local` first.');
  process.exit(2);
}

const dirs = (dir) => (existsSync(dir) ? readdirSync(dir).filter((n) => statSync(join(dir, n)).isDirectory()).sort() : []);
const tsFiles = (dir) => (existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith('.ts')).sort().map((n) => join(dir, n)) : []);

// Every case, with the kind its folder gives it.
const cases = TYPES.flatMap((type) => dirs(join(lab, type)).flatMap((label) => {
  const dir = join(lab, type, label);
  return [
    ...tsFiles(dir).map((file) => ({ type, label, file, kind: 'witness' })),
    ...tsFiles(join(dir, 'controls')).map((file) => ({ type, label, file, kind: 'control' })),
    ...tsFiles(join(dir, 'rejected-sound-code')).map((file) => ({ type, label, file, kind: 'sound' })),
  ];
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
const description = (text) => text.split('\n').filter((l) => l.startsWith('//')).map((l) => l.replace(/^\/\/ ?/, '')).join(' ').replace(/\s+/g, ' ');

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
  if (accepted.length) problems.push(`the release rejects line ${lines(accepted).join(', ')}: ${head(accepted[0])}`);
  if (c.kind === 'witness' && !(threw && /TypeError|ReferenceError/.test(run.stderr))) problems.push('Node does not throw a TypeError or ReferenceError');
  if (c.kind !== 'witness' && threw) problems.push(`Node throws: ${run.stderr.split('\n').find((l) => /Error/.test(l)) ?? run.stderr.trim()}`);
  if (c.kind === 'control' && marks.length) problems.push('a control marks a line to reject');
  for (const m of marks.filter((m) => m.code === undefined)) problems.push(`line ${m.line} is marked without the diagnostic its mechanism emits`);
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
const rules = [...new Set(judged.map((c) => `${c.type}/${c.label}`))].map((key) => {
  const r = judged.filter((c) => `${c.type}/${c.label}` === key);
  return { type: r[0].type, label: r[0].label, cases: r };
});
const count = (r, kind, status) => r.cases.filter((c) => c.kind === kind && (status === undefined || c.status === status)).length;
const standing = (r) => {
  if (r.cases.some((c) => c.status === 'broken')) return 'broken';
  if (r.cases.some((c) => c.status === 'failing')) return 'false positives';
  if (r.cases.some((c) => c.status === 'open')) return 'holes open';
  return 'sound';
};

const out = ['# L lab: where each rule stands', ''];
for (const g of [...release.global.map((d) => `the release: ${d}`), ...built.global.map((d) => `the lab: ${d}`)]) out.push(`Program diagnostic from ${g}`, '');
out.push('| Type | Rule | Standing | Witnesses closed | Witnesses open | Controls passing | Controls failing | Rejected as designed | Broken |');
out.push('|---|---|---|---|---|---|---|---|---|');
for (const r of rules) {
  out.push(`| ${r.type} | ${r.label} | ${standing(r)} | ${count(r, 'witness', 'closed')}/${count(r, 'witness')} | ${count(r, 'witness', 'open')} | ` +
    `${count(r, 'control', 'passing')}/${count(r, 'control')} | ${count(r, 'control', 'failing')} | ${count(r, 'sound', 'rejected as designed')} | ` +
    `${r.cases.filter((c) => c.status === 'broken').length} |`);
}
for (const type of TYPES) {
  if (!rules.some((r) => r.type === type)) out.push(`| ${type} | (no rules filed yet) | | | | | | | |`);
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
const fails = release.global.length || built.global.length || judged.some((c) => c.status === 'broken' || c.status === 'failing');
process.exit(fails ? 1 : 0);
