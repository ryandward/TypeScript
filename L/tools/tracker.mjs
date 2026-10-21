// The lab's source of truth: runs every L case through the 6.0.3 release, the lab build and Node, and prints a
// markdown matrix of where each rule stands, then where the catalog stands. Exits 1 if any case is broken or any
// control fails.
//
//   node L/tools/tracker.mjs [rule ...]          default: every rule and the catalog; name `catalog` for it alone
//
// Each rule is a folder, L/rules/<rule>/, holding its rule.txt and its cases. rule.txt is the rule's proof: its
// obligations, each with the L code its mechanism reports, cite every case they rest on, and the tracker holds the
// folder to the proof (see rules.mjs). A case's first line says what it is for:
// `// witness:`, `// control:` or `// rejected sound code:`. A marked line names the diagnostic its mechanism emits,
// `// rejected here: TS2890`, optionally followed by text that diagnostic's chain must contain. A rejection only counts
// when a diagnostic on that line carries both.
//
// L/catalog/ holds crashes no rule claims yet: each a witness that the release accepts and Node crashes on. The lab
// either accepts it (open) or rejects it with no rule citing it, which means a rule's mechanism may close it and the
// case should move into that rule's folder, marked and cited.
//
// Each case is compiled in a program of its own, so a global one case declares can't reach another, under L's catalog
// options (strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes) and the esnext library, the way the core is
// compiled: no DOM, no Node and no @types. The library also carries console.d.ts, so a case can show a value. Every case
// is a module, except one whose name says it is a script. Node runs what the release emits for the case, so a case may
// use syntax Node's type stripping refuses, such as an enum or a parameter property.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { KINDS, readRules } from './rules.mjs';

const lab = join(import.meta.dirname, '..');
const repo = join(lab, '..');
const RULES = join(lab, 'rules');
const CATALOG = join(lab, 'catalog');
const CONSOLE = join(lab, 'tools', 'console.d.ts');
const RELEASE = join(repo, 'lib/typescript.js');
const LAB = join(repo, 'built/local/typescript.js');
const MARK = /\/\/ rejected here(?:: TS(\d+)(?: (.*\S))?)?\s*$/;
const ROLE = /^\/\/ (witness|control|rejected sound code): /;
const KIND_OF_ROLE = { witness: 'witness', control: 'control', 'rejected sound code': 'sound' };
const ROLE_NAME = { witness: 'a witness', control: 'a control', sound: 'rejected sound code' };
const wanted = process.argv.slice(2);
const withCatalog = wanted.length === 0 || wanted.includes('catalog');

if (!existsSync(LAB)) {
  console.error('No lab build at built/local/typescript.js: run `npx hereby local` first.');
  process.exit(2);
}

const rules = readRules(RULES).filter((r) => wanted.length === 0 || wanted.includes(r.name))
  .sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind) || a.name.localeCompare(b.name));

// A case, with the role its first line gives it, and the rule whose folder holds it (none for the catalog).
const caseAt = (rule, file) => {
  const role = ROLE.exec(readFileSync(file, 'utf8'))?.[1];
  return { rule, file, kind: role === undefined ? undefined : KIND_OF_ROLE[role] };
};
const tsIn = (dir) => readdirSync(dir).filter((n) => n.endsWith('.ts')).sort();
const cases = rules.flatMap((rule) => tsIn(rule.dir).map((n) => caseAt(rule, join(rule.dir, n))));
const catalog = withCatalog && existsSync(CATALOG) ? tsIn(CATALOG).map((n) => caseAt(undefined, join(CATALOG, n))) : [];
const everyCase = [...cases, ...catalog];
// Every rule folder's case names, to find a catalog case that a rule's folder also holds.
const ruleCaseNames = new Map(readRules(RULES).flatMap((r) => tsIn(r.dir).map((n) => [n, r.name])));

const named = (file, word) => file.split(sep).pop().includes(word);

// A compiler host for one compiler. Its library carries console.log (tools/console.d.ts), the one host function a case
// may call, as part of lib.es5.d.ts, which every library level loads: a declaration file of the program's own would
// be the program's, and the core has no ambient declarations. Library files are parsed once. LIBRARY_ROOT is an empty
// module, to compile the library with and nothing else.
const CONSOLE_TEXT = readFileSync(CONSOLE, 'utf8');
const LIBRARY_ROOT = join(lab, 'tools', 'library-root.ts');
function hostFor(ts, options) {
  const host = ts.createCompilerHost(options);
  const libDir = host.getDefaultLibLocation();
  const es5 = `${libDir}/lib.es5.d.ts`;
  const libs = new Map();
  const read = host.getSourceFile;
  host.getSourceFile = (fileName, version, ...rest) => {
    if (fileName === LIBRARY_ROOT) return ts.createSourceFile(fileName, 'export {};\n', version);
    if (!fileName.startsWith(libDir)) return read(fileName, version, ...rest);
    if (!libs.has(fileName)) {
      libs.set(fileName, fileName === es5 ? ts.createSourceFile(fileName, `${ts.sys.readFile(fileName)}\n${CONSOLE_TEXT}`, version) : read(fileName, version, ...rest));
    }
    return libs.get(fileName);
  };
  return host;
}

// The diagnostics one compiler gives every case, by file: each with its line and its whole chain, flattened.
function diagnose(path) {
  const ts = createRequire(import.meta.url)(path);
  const options = (file) => ({
    strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: true, types: [],
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, lib: ['lib.esnext.d.ts'],
    moduleDetection: named(file, 'script') ? ts.ModuleDetectionKind.Legacy : ts.ModuleDetectionKind.Force,
  });
  const host = hostFor(ts, options(''));
  const flatten = (m) => [{ code: m.code, text: m.messageText }, ...(m.next ?? []).flatMap(flatten)];
  const byFile = new Map();
  const global = [];
  for (const c of everyCase) {
    const found = [];
    for (const d of ts.getPreEmitDiagnostics(ts.createProgram([c.file], options(c.file), host))) {
      const chain = typeof d.messageText === 'string' ? [{ code: d.code, text: d.messageText }] : flatten(d.messageText);
      if (d.file && d.file.fileName === c.file) found.push({ line: d.file.getLineAndCharacterOfPosition(d.start).line + 1, chain });
      else global.push(`TS${chain[0].code}: ${chain[0].text}`);
    }
    byFile.set(c.file, found);
  }
  return { byFile, global: [...new Set(global)] };
}

const release = diagnose(RELEASE);
const built = diagnose(LAB);

// The core's library, checked whole by the lab with skipLibCheck off: a rule of the lab's that fires on a
// declaration of the library breaks every core project that checks its libraries, and the cases never see it.
function libraryDiagnostics() {
  const ts = createRequire(import.meta.url)(LAB);
  const options = { strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true,
    noEmit: true, types: [], target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, lib: ['lib.esnext.d.ts'] };
  const program = ts.createProgram([LIBRARY_ROOT], options, hostFor(ts, options));
  return ts.getPreEmitDiagnostics(program).map((d) => `${d.file ? `${d.file.fileName.split(sep).pop()}: ` : ''}TS${d.code}: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
}
const library = libraryDiagnostics();
const lines = (ds) => [...new Set(ds.map((d) => d.line))].sort((a, b) => a - b);
const head = (d) => `TS${d.chain[0].code}: ${d.chain[0].text}`;
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const description = (text) => text.split('\n').filter((l) => l.startsWith('//')).map((l) => l.replace(ROLE, '').replace(/^\/\/ ?/, '')).join(' ').replace(/\s+/g, ' ');

// Node runs the JavaScript the release emits for a case. The lab doesn't change what is emitted.
const work = mkdtempSync(join(tmpdir(), 'l-tracker-'));
const emitter = createRequire(import.meta.url)(RELEASE);
function run(c) {
  const js = join(work, `${relative(lab, c.file).split(sep).join('-')}.mjs`);
  const { outputText } = emitter.transpileModule(readFileSync(c.file, 'utf8'), {
    fileName: c.file, compilerOptions: { target: emitter.ScriptTarget.ES2022, module: emitter.ModuleKind.ESNext },
  });
  writeFileSync(js, outputText);
  return spawnSync(process.execPath, [js], { encoding: 'utf8', timeout: 10_000 });
}

// One case: what its first line, its marks, the two compilers and Node say about it, and its problems.
function facts(c) {
  const text = readFileSync(c.file, 'utf8');
  const marks = text.split('\n').flatMap((l, i) => {
    const m = MARK.exec(l);
    return m ? [{ line: i + 1, code: m[1] === undefined ? undefined : Number(m[1]), fragment: m[2] }] : [];
  });
  const accepted = release.byFile.get(c.file);
  const got = built.byFile.get(c.file);
  const ran = run(c);
  const threw = ran.status !== 0;
  const problems = [];
  if (c.kind === undefined) problems.push('the first line doesn\'t say whether it is a witness, a control or rejected sound code');
  if (accepted.length) problems.push(`the release rejects line ${lines(accepted).join(', ')}: ${head(accepted[0])}`);
  if (c.kind === 'witness' && !(threw && /TypeError|ReferenceError/.test(ran.stderr))) problems.push('Node does not throw a TypeError or ReferenceError');
  if (c.kind !== 'witness' && threw) problems.push(`Node throws: ${ran.stderr.split('\n').find((l) => /Error/.test(l)) ?? ran.stderr.trim()}`);
  const base = c.file.split(sep).pop();
  return { text, marks, got, problems, base };
}

const summary = (c, text, got, marks) => ({
  name: relative(lab, c.file).split(sep).join('/'),
  about: description(text),
  lab: got,
  mechanism: [...new Set(marks.map((m) => `TS${m.code}`))].join(', '),
});

// A case in a rule's folder: where it stands against the rule's proof.
function judge(c) {
  const { text, marks, got, problems, base } = facts(c);
  if (c.kind === 'control' && marks.length) problems.push('a control marks a line to reject');
  for (const m of marks.filter((m) => m.code === undefined)) problems.push(`line ${m.line} is marked without the diagnostic its mechanism emits`);
  // rule.txt cites the case under each obligation it supports, in the role the case's first line claims. A marker
  // names the code of an obligation that cites the case, and a rejection cited under an obligation marks its code.
  const citing = c.rule.mechanisms.filter((o) => o.cites.some((x) => x.file === base));
  if (citing.length === 0) problems.push('rule.txt doesn\'t cite this case under any obligation');
  for (const o of citing) {
    const role = o.cites.find((x) => x.file === base).role;
    if (c.kind !== undefined && role !== c.kind) problems.push(`rule.txt cites it as ${ROLE_NAME[role]} under obligation ${o.number}, but its first line says ${ROLE_NAME[c.kind]}`);
    // A witness with no marked line is a hole the lab hasn't closed yet, so it is open, not broken.
    if (role !== 'control' && !(role === 'witness' && marks.length === 0) && !marks.some((m) => m.code === o.code)) problems.push(`rule.txt cites it under obligation ${o.number}, TS${o.code}, but no line is marked TS${o.code}`);
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
  return { ...c, status, problems, ...summary(c, text, got, marks) };
}

// A case in the catalog: a crash the release accepts, which the lab either accepts (open) or rejects with no rule
// citing it (rejected). Once a rule's mechanism closes it, the case moves into that rule's folder.
function judgeCatalog(c) {
  const { text, marks, got, problems, base } = facts(c);
  if (c.kind !== undefined && c.kind !== 'witness') problems.push(`the catalog holds witnesses, and its first line says ${ROLE_NAME[c.kind]}`);
  if (marks.length) problems.push('a catalog case marks no line: a rule that closes it takes it into its own folder');
  if (ruleCaseNames.has(base)) problems.push(`rules/${ruleCaseNames.get(base)}/ holds a case of the same name`);
  const status = problems.length ? 'broken' : got.length ? 'rejected' : 'open';
  return { ...c, status, problems, ...summary(c, text, got, marks) };
}

const judged = cases.map(judge);
const catalogued = catalog.map(judgeCatalog);
rmSync(work, { recursive: true, force: true });
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
for (const d of library) out.push(`The core's library doesn't compile under the lab: ${d}`, '');
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
if (withCatalog) {
  const n = (status) => catalogued.filter((c) => c.status === status).length;
  out.push('', `The catalog holds ${catalogued.length} crashes no rule claims yet: ${n('open')} the lab accepts, ${n('rejected')} it rejects ` +
    `with no rule citing them, and ${n('broken')} broken.`);
}
// debt.txt files each item under a rule's name, lab or L-hooks, so a heading that names no rule is stale.
const debt = existsSync(join(lab, 'debt.txt')) ? readFileSync(join(lab, 'debt.txt'), 'utf8').split('\n') : [];
const staleDebt = debt.filter((l) => /^[A-Za-z][A-Za-z-]*$/.test(l) && l !== 'lab' && l !== 'L-hooks' && !readRules(RULES).some((r) => r.name === l));
for (const heading of staleDebt) out.push(`debt.txt files items under ${heading}, which isn't a rule`, '');
const broken = rules.filter((r) => r.problems.length);
if (broken.length) {
  out.push('', '## Rules with a broken rule.txt', '');
  for (const r of broken) out.push(`- \`rules/${r.name}/rule.txt\`: ${r.problems.join('; ')}`);
}
const section = (title, from, status, detail) => {
  const listed = from.filter((c) => c.status === status);
  if (!listed.length) return;
  out.push('', `## ${title}`, '');
  for (const c of listed) out.push(`- \`${c.name}\`${detail(c)}`);
};
const codes = (c) => [...new Set(c.lab.map((d) => `TS${d.chain[0].code}`))].join(', ');
section('Broken cases', [...judged, ...catalogued], 'broken', (c) => `: ${c.problems.join('; ')}`);
section('Controls the lab rejects (false positives)', judged, 'failing', (c) => `: ${c.about} The lab says: ${head(c.lab[0])}`);
section('Holes still open', judged, 'open', (c) => `: ${c.about}`);
section('Witnesses closed', judged, 'closed', (c) => ` (${c.mechanism}): ${c.about}`);
section('Rejected as designed', judged, 'rejected as designed', (c) => ` (${c.mechanism}): ${c.about}`);
section('Catalog: rejected by the lab, waiting for a rule to cite them', catalogued, 'rejected', (c) => ` (${codes(c)}): ${c.about}`);
section('Catalog: open', catalogued, 'open', (c) => `: ${c.about}`);
console.log(out.join('\n'));
const fails = release.global.length || built.global.length || library.length || broken.length || staleDebt.length ||
  [...judged, ...catalogued].some((c) => c.status === 'broken' || c.status === 'failing');
process.exit(fails ? 1 : 0);
