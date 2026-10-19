// What the lab rejects in a project that the 6.0.3 release accepts, on the lines changed since the merge base with
// main. Each diagnostic is shown with the L mechanism in its chain, if any: one without is the lab changing how an
// unrelated construct is checked, and is listed first.
//
//   node L/compare.mjs <tsconfig.json> [<tsconfig.json> ...]
//
// The project's own code is only type-checked; nothing in it runs.
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';

const repo = join(import.meta.dirname, '..');
const RELEASE = join(repo, 'lib/typescript.js');
const LAB = join(repo, 'built/local/typescript.js');
const MECHANISMS = new Map([
  [2890, 'writable position'],
  [2891, 'write-induced invariance'],
  [2892, 'binding without an initializer'],
  [2893, 'assignment to a binding'],
]);
const configs = process.argv.slice(2);
if (!configs.length) {
  console.error('usage: node L/compare.mjs <tsconfig.json> [<tsconfig.json> ...]');
  process.exit(2);
}

// The lines each file changed since the merge base with main, as git reports them.
const top = execFileSync('git', ['-C', dirname(configs[0]), 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const base = execFileSync('git', ['-C', top, 'merge-base', 'main', 'HEAD'], { encoding: 'utf8' }).trim();
const changed = new Map();
let file;
for (const line of execFileSync('git', ['-C', top, 'diff', '-U0', base, '--', '*.ts', '*.tsx'], { encoding: 'utf8', maxBuffer: 1 << 28 }).split('\n')) {
  if (line.startsWith('+++ ')) file = line.startsWith('+++ b/') ? join(top, line.slice(6)) : undefined;
  const hunk = /^@@ -\S+ \+(\d+)(?:,(\d+))? @@/.exec(line);
  if (hunk && file) {
    const lines = changed.get(file) ?? new Set();
    for (let n = Number(hunk[1]); n < Number(hunk[1]) + Number(hunk[2] ?? 1); n++) lines.add(n);
    changed.set(file, lines);
  }
}

// Every diagnostic one compiler gives a project, with its whole chain flattened.
function diagnose(path, config) {
  const ts = createRequire(import.meta.url)(path);
  const parsed = ts.getParsedCommandLineOfConfigFile(config, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: (d) => { throw new Error(String(d.messageText)); } });
  const program = ts.createProgram({ rootNames: parsed.fileNames, options: { ...parsed.options, noEmit: true }, projectReferences: parsed.projectReferences });
  const flatten = (m) => [{ code: m.code, text: m.messageText }, ...(m.next ?? []).flatMap(flatten)];
  return ts.getPreEmitDiagnostics(program).filter((d) => d.file).map((d) => ({
    file: d.file.fileName,
    line: d.file.getLineAndCharacterOfPosition(d.start).line + 1,
    chain: typeof d.messageText === 'string' ? [{ code: d.code, text: d.messageText }] : flatten(d.messageText),
  }));
}

const key = (d) => `${d.file}:${d.line}:${d.chain[0].code}:${d.chain[0].text}`;
const found = configs.flatMap((config) => {
  const accepted = new Set(diagnose(RELEASE, config).map(key));
  return diagnose(LAB, config).filter((d) => !accepted.has(key(d)) && changed.get(d.file)?.has(d.line));
});
const unique = [...new Map(found.map((d) => [key(d), d])).values()];
const mechanism = (d) => d.chain.map((x) => x.code).find((c) => MECHANISMS.has(c));
const show = (d) => {
  const m = mechanism(d);
  const deepest = [...d.chain].reverse().find((x) => x.code === m);
  return `- \`${relative(top, d.file)}:${d.line}\` TS${d.chain[0].code}: ${d.chain[0].text}` + (m ? `\n  - TS${m} (${MECHANISMS.get(m)}): ${deepest.text}` : '');
};
const unexplained = unique.filter((d) => !mechanism(d));
const explained = unique.filter((d) => mechanism(d));
const out = [
  `# Lab against the release: ${relative(dirname(top), top)}, lines changed since ${base.slice(0, 9)}`, '',
  `${unique.length} rejections the release doesn't make: ${unexplained.length} with no L mechanism in the chain, ${explained.length} with one.`,
];
if (unexplained.length) out.push('', '## No L mechanism in the chain', '', ...unexplained.map(show));
for (const [code, name] of MECHANISMS) {
  const these = explained.filter((d) => mechanism(d) === code);
  if (these.length) out.push('', `## TS${code}: ${name}`, '', ...these.map(show));
}
console.log(out.join('\n'));
