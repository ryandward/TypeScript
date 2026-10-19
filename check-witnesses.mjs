// Holds every L rule folder to its files: node check-witnesses.mjs [folder ...]
//
//   <type>/<rule-label>/<witness>.ts        the 6.0.3 release (lib/tsc.js) accepts it and Node throws
//                                           running it; the lab build (built/local/tsc.js) rejects exactly
//                                           the lines marked `// rejected here`. With no marked line the
//                                           hole is still open, and the lab must accept it too.
//   <type>/<rule-label>/controls.ts         both compilers accept it and it runs without throwing.
//   <type>/<rule-label>/rejected-sound-code.ts
//                                           the release accepts it and it runs without throwing; the lab
//                                           rejects exactly the marked lines.
import { execFileSync, spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = import.meta.dirname;
const RELEASE = join(root, 'lib/tsc.js');
const LAB = join(root, 'built/local/tsc.js');
const FLAGS = ['--strict', '--noEmit', '--target', 'es2022', '--module', 'esnext', '--moduleDetection', 'force', '--skipLibCheck', '--pretty', 'false'];
const MARK = '// rejected here';

const filesUnder = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? filesUnder(path) : name.endsWith('.ts') ? [path] : [];
});
const folders = process.argv.length > 2 ? process.argv.slice(2) : ['soundness', 'policy', 'information', 'project'];
const files = folders.flatMap((f) => filesUnder(join(root, f))).sort();

// The lines a compiler reports errors on, in this file.
const errorLines = (tsc, file) => {
  const out = spawnSync(process.execPath, [tsc, ...FLAGS, file], { encoding: 'utf8' }).stdout;
  const name = relative(root, file).replaceAll('\\', '/');
  return [...new Set(out.split('\n').flatMap((l) => {
    const m = /^(.*)\((\d+),\d+\): error TS/.exec(l);
    return m && relative(root, m[1]).replaceAll('\\', '/') === name ? [Number(m[2])] : [];
  }))].sort((a, b) => a - b);
};
const markedLines = (file) => readFileSync(file, 'utf8').split('\n').flatMap((l, i) => (l.includes(MARK) ? [i + 1] : []));
const runs = (file) => spawnSync(process.execPath, [file], { encoding: 'utf8', timeout: 10_000 });
const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

let failed = 0;
for (const file of files) {
  const name = relative(root, file);
  const kind = file.endsWith('/controls.ts') ? 'control' : file.endsWith('/rejected-sound-code.ts') ? 'sound' : 'witness';
  const marked = markedLines(file);
  const release = errorLines(RELEASE, file);
  const lab = errorLines(LAB, file);
  const run = runs(file);
  const problems = [];
  if (release.length) problems.push(`the release rejects lines ${release.join(', ')}`);
  if (kind === 'witness' && (run.status === 0 || !/TypeError|ReferenceError/.test(run.stderr))) problems.push('Node does not throw a TypeError or ReferenceError');
  if (kind !== 'witness' && run.status !== 0) problems.push(`Node throws: ${run.stderr.split('\n').find((l) => /Error/.test(l)) ?? run.stderr.trim()}`);
  if (kind === 'control' && lab.length) problems.push(`the lab rejects lines ${lab.join(', ')}`);
  if (kind !== 'control' && !same(lab, marked)) problems.push(`the lab rejects lines [${lab.join(', ')}], marked [${marked.join(', ')}]`);
  const status = problems.length ? 'FAIL' : kind === 'witness' && marked.length === 0 ? 'open' : 'ok';
  if (problems.length) failed++;
  console.log(`${status.padEnd(4)}  ${name}${problems.length ? `\n      ${problems.join('\n      ')}` : ''}`);
}
console.log(`${files.length} files, ${failed} failing`);
process.exit(failed ? 1 : 0);
