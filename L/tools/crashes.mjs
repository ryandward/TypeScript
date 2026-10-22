// Compiles every .ts and .tsx case under tests/cases/compiler and tests/cases/conformance with the lab build and with
// the 6.0.3 release, under L's options, and prints each case on which the lab's checker throws and the release's
// doesn't: an exception the fork brought in. It reads no baselines, so a case's expected diagnostics don't matter,
// only whether the checker survives it. A worker that never finishes names the case it hung on.
//
//   node L/tools/crashes.mjs [workers]
//
// Build the lab first with `npx hereby local`.
import { createRequire } from 'node:module';
import { readdirSync, statSync, readFileSync, writeFileSync, appendFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');

if (process.argv[2] === '--worker') {
  // A worker: one compiler, a slice of the cases, a log of each case started and each exception thrown.
  const [, , , tsPath, listPath, index, count, outPath] = process.argv;
  const ts = createRequire(import.meta.url)(tsPath);
  const files = readFileSync(listPath, 'utf8').split('\n').filter(Boolean).filter((_, i) => i % Number(count) === Number(index));
  const opts = {
    strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true, noEmit: true, skipLibCheck: true, types: [],
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, lib: ['lib.esnext.d.ts'], jsx: ts.JsxEmit.Preserve,
    moduleDetection: ts.ModuleDetectionKind.Force,
  };
  const host = ts.createCompilerHost(opts);
  const libDir = host.getDefaultLibLocation();
  const libs = new Map();
  const read = host.getSourceFile;
  host.getSourceFile = (fn, v, ...rest) => {
    if (!fn.startsWith(libDir)) return read(fn, v, ...rest);
    if (!libs.has(fn)) libs.set(fn, read(fn, v, ...rest));
    return libs.get(fn);
  };
  writeFileSync(outPath, '');
  for (const f of files) {
    appendFileSync(outPath, `START ${f}\n`);
    try {
      ts.getPreEmitDiagnostics(ts.createProgram([f], opts, host));
    } catch (e) {
      const frames = (e.stack ?? '').split('\n').slice(1, 4).map((l) => l.trim().replace(/^at /, '').split(' (')[0]).join(' < ');
      appendFileSync(outPath, `CRASH ${f} :: ${String(e.message).split('\n')[0].slice(0, 160)} :: ${frames}\n`);
    }
  }
  appendFileSync(outPath, 'DONE\n');
  process.exit(0);
}

const workers = Number(process.argv[2] ?? 6);
const cases = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? cases(path) : /\.tsx?$/.test(name) ? [path] : [];
});
const files = ['compiler', 'conformance'].flatMap((d) => cases(join(root, 'tests', 'cases', d))).sort();
const work = mkdtempSync(join(tmpdir(), 'crashes-'));
const list = join(work, 'list.txt');
writeFileSync(list, files.join('\n'));

const run = (label, tsPath) => Promise.all(Array.from({ length: workers }, (_, i) => new Promise((done) => {
  const out = join(work, `${label}-${i}.log`);
  const child = spawn(process.execPath, ['--stack-size=4000', fileURLToPath(import.meta.url), '--worker', tsPath, list, String(i), String(workers), out], { stdio: 'ignore' });
  const timer = setTimeout(() => child.kill(), 60 * 60 * 1000);
  child.on('exit', () => { clearTimeout(timer); done(readFileSync(out, 'utf8')); });
})));

const logs = await Promise.all([run('lab', join(root, 'built', 'local', 'typescript.js')), run('release', join(root, 'lib', 'typescript.js'))]);
const crashes = (texts) => new Map(texts.flatMap((t) => t.split('\n').filter((l) => l.startsWith('CRASH ')).map((l) => {
  const [file, ...rest] = l.slice(6).split(' :: ');
  return [file, rest.join(' :: ')];
})));
const hangs = (texts) => texts.filter((t) => !t.trimEnd().endsWith('DONE')).map((t) => t.split('\n').filter((l) => l.startsWith('START ')).pop()?.slice(6) ?? '(none started)');
const [lab, release] = logs.map(crashes);
const fresh = [...lab].filter(([file]) => !release.has(file));

console.log(`${files.length} cases. The lab throws on ${lab.size}, the release on ${release.size}, and only the lab on ${fresh.length}.`);
for (const [file, what] of fresh) console.log(`- ${relative(root, file)}: ${what}`);
for (const file of hangs(logs[0])) console.log(`- the lab hung on ${relative(root, file)}`);
for (const file of hangs(logs[1])) console.log(`- the release hung on ${relative(root, file)}`);
rmSync(work, { recursive: true, force: true });
process.exit(fresh.length || hangs(logs[0]).length ? 1 : 0);
