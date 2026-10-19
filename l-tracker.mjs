// The lab's source of truth: runs every L case through the 6.0.3 release, the lab build and Node, and prints a
// markdown matrix of where each rule stands. Exits 1 if any case is broken or any control fails.
//
//   node l-tracker.mjs [type ...]          default: soundness policy information project
//
// The hierarchy is <type>/<rule-label>/..., and a case's place in it says what it must do:
//
//   <type>/<rule>/<witness>.ts                    a hole. The release accepts it and Node throws running it.
//                                                 Closed when the lab rejects exactly the lines marked
//                                                 `// rejected here`; open while no line is marked and the
//                                                 lab still accepts it.
//   <type>/<rule>/controls/<case>.ts              must stay accepted: both compilers accept it, Node runs it.
//   <type>/<rule>/rejected-sound-code/<case>.ts   safe, but rejected on purpose: the release accepts it, Node
//                                                 runs it, the lab rejects exactly the marked lines.
//
// A case's first comment says what it is, and the report quotes it.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const root = import.meta.dirname;
const RELEASE = join(root, 'lib/tsc.js');
const LAB = join(root, 'built/local/tsc.js');
const FLAGS = ['--strict', '--noEmit', '--target', 'es2022', '--module', 'esnext', '--moduleDetection', 'force', '--skipLibCheck', '--pretty', 'false'];
const MARK = '// rejected here';
const TYPES = process.argv.length > 2 ? process.argv.slice(2) : ['soundness', 'policy', 'information', 'project'];

if (!existsSync(LAB)) {
  console.error('No lab build at built/local/tsc.js: run `npx hereby local` first.');
  process.exit(2);
}

const dirs = (dir) => (existsSync(dir) ? readdirSync(dir).filter((n) => statSync(join(dir, n)).isDirectory()).sort() : []);
const tsFiles = (dir) => (existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith('.ts')).sort().map((n) => join(dir, n)) : []);

// Errors a compiler reports in this file, as { line, text }.
function errors(tsc, file) {
  const out = spawnSync(process.execPath, [tsc, ...FLAGS, file], { encoding: 'utf8' }).stdout;
  const name = relative(root, file);
  return out.split('\n').flatMap((l) => {
    const m = /^(.*)\((\d+),\d+\): error (TS\d+: .*)$/.exec(l);
    return m && relative(root, m[1]) === name ? [{ line: Number(m[2]), text: m[3] }] : [];
  });
}
const lines = (es) => [...new Set(es.map((e) => e.line))].sort((a, b) => a - b);
const marked = (text) => text.split('\n').flatMap((l, i) => (l.includes(MARK) ? [i + 1] : []));
const description = (text) => text.split('\n').filter((l) => l.startsWith('//')).map((l) => l.replace(/^\/\/ ?/, '')).join(' ').replace(/\s+/g, ' ');
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

// One case: what kind it is, and where it stands.
function judge(file, kind) {
  const text = readFileSync(file, 'utf8');
  const marks = marked(text);
  const release = errors(RELEASE, file);
  const lab = errors(LAB, file);
  const run = spawnSync(process.execPath, [file], { encoding: 'utf8', timeout: 10_000 });
  const threw = run.status !== 0;
  const problems = [];
  if (release.length) problems.push(`the release rejects line ${lines(release).join(', ')}: ${release[0].text}`);
  if (kind === 'witness' && !(threw && /TypeError|ReferenceError/.test(run.stderr))) problems.push('Node does not throw a TypeError or ReferenceError');
  if (kind !== 'witness' && threw) problems.push(`Node throws: ${run.stderr.split('\n').find((l) => /Error/.test(l)) ?? run.stderr.trim()}`);
  let status;
  if (problems.length) status = 'broken';
  else if (kind === 'witness') status = marks.length === 0 ? (lab.length ? 'broken' : 'open') : same(lines(lab), marks) ? 'closed' : 'broken';
  else if (kind === 'control') status = lab.length ? 'failing' : 'passing';
  else status = same(lines(lab), marks) ? 'rejected as designed' : 'broken';
  if (status === 'broken' && !problems.length) {
    problems.push(`the lab rejects line${lab.length === 1 ? '' : 's'} [${lines(lab).join(', ')}], marked [${marks.join(', ')}]${lab.length ? `: ${lab[0].text}` : ''}`);
  }
  return { name: relative(root, file).split(sep).join('/'), kind, status, about: description(text), lab, problems };
}

function rule(type, label) {
  const dir = join(root, type, label);
  return {
    type,
    label,
    cases: [
      ...tsFiles(dir).map((f) => judge(f, 'witness')),
      ...tsFiles(join(dir, 'controls')).map((f) => judge(f, 'control')),
      ...tsFiles(join(dir, 'rejected-sound-code')).map((f) => judge(f, 'sound')),
    ],
  };
}

const rules = TYPES.flatMap((type) => dirs(join(root, type)).map((label) => rule(type, label)));
const count = (r, kind, status) => r.cases.filter((c) => c.kind === kind && (status === undefined || c.status === status)).length;
const standing = (r) => {
  if (r.cases.some((c) => c.status === 'broken')) return 'broken';
  if (r.cases.some((c) => c.status === 'failing')) return 'false positives';
  if (r.cases.some((c) => c.status === 'open')) return 'holes open';
  return 'sound';
};

const out = [];
out.push('# L lab: where each rule stands', '');
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
const section = (title, cases, detail) => {
  if (!cases.length) return;
  out.push('', `## ${title}`, '');
  for (const c of cases) out.push(`- \`${c.name}\`: ${detail(c)}`);
};
const all = rules.flatMap((r) => r.cases);
section('Broken cases', all.filter((c) => c.status === 'broken'), (c) => c.problems.join('; '));
section('Controls the lab rejects (false positives)', all.filter((c) => c.status === 'failing'), (c) => `${c.about} The lab says: ${c.lab[0].text}`);
section('Holes still open', all.filter((c) => c.status === 'open'), (c) => c.about);
section('Rejected as designed', all.filter((c) => c.status === 'rejected as designed'), (c) => c.about);
console.log(out.join('\n'));
process.exit(all.some((c) => c.status === 'broken' || c.status === 'failing') ? 1 : 0);
