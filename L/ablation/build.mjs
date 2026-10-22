// Builds TypeScript-L with one mechanism switched off: every hunk of the fork against v6.0.3 that labels.json gives
// that mechanism is reverted to TypeScript 6.0.3's text, the compiler is built, and its typescript.js and library are
// kept under the cache. The source is restored afterwards. Hunks labelled infra (shared helpers) or complete (changes
// that only make the lab accept more) are never reverted.
//
//   node L/ablation/build.mjs <mechanism|none> [--cache <dir>]
//
// A label's mode says what reverting it means: full reverts the whole hunk; drop removes added lines [a, b] (1-based,
// within the hunk); replace puts the hunk's deleted lines [c, d] (all of them when old is absent) in place of added
// lines [a, b], and with b = a - 1 inserts them before added line a; text puts the selector's own lines there.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const BASE = 'v6.0.3';
const args = process.argv.slice(2);
const mechanism = args[0];
const cacheAt = args.indexOf('--cache');
const CACHE = cacheAt >= 0 ? args[cacheAt + 1] : join(ROOT, '..', 'TypeScript-L-ablation-builds');
const labels = JSON.parse(readFileSync(join(import.meta.dirname, 'labels.json'), 'utf8'));
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 });

// The minimal hunks of one file, in order: where they start in each version and the lines each side has. The diff is
// split into lines by hand, keeping a CRLF file's carriage returns, since a regular expression's . doesn't match \r.
function hunks(file) {
  const out = [];
  let h;
  for (const line of git('diff', '-U0', BASE, '--', file).split('\n')) {
    const m = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (m) { h = { newStart: Number(m[3]), newCount: m[4] === undefined ? 1 : Number(m[4]), removed: [], added: [] }; out.push(h); }
    else if (h && line.startsWith('-')) h.removed.push(line.slice(1));
    else if (h && line.startsWith('+')) h.added.push(line.slice(1));
  }
  return out;
}

function revert(file, wanted) {
  const text = readFileSync(join(ROOT, file), 'utf8');
  const lines = text.split('\n');
  const edits = [];
  hunks(file).forEach((h, k) => {
    if (h.added.length !== h.newCount) throw new Error(`${file}#${k}: parsed ${h.added.length} added lines, header says ${h.newCount}`);
    for (const sel of labels[`${file}#${k}`] ?? []) {
      if (sel.label !== wanted) continue;
      // The index in lines of the hunk's first added line; a pure deletion's old lines go after line newStart.
      const at = h.newCount === 0 ? h.newStart : h.newStart - 1;
      if (sel.mode === 'full') edits.push({ at, count: h.newCount, put: h.removed });
      else if (sel.mode === 'drop') edits.push({ at: at + sel.lines[0] - 1, count: sel.lines[1] - sel.lines[0] + 1, put: [] });
      else if (sel.mode === 'replace') {
        const old = sel.old ? h.removed.slice(sel.old[0] - 1, sel.old[1]) : h.removed;
        edits.push({ at: at + sel.lines[0] - 1, count: sel.lines[1] - sel.lines[0] + 1, put: old });
      }
      else if (sel.mode === 'text') {
        // Text written for the switch where neither side's lines can be taken whole, in the file's own line ending.
        const eol = lines[0]?.endsWith('\r') ? '\r' : '';
        edits.push({ at: at + sel.lines[0] - 1, count: sel.lines[1] - sel.lines[0] + 1, put: sel.text.map((t) => t + eol) });
      }
      else throw new Error(`unknown mode ${sel.mode} at ${file}#${k}`);
    }
  });
  // Later edits first, so an edit's position is never moved by another.
  edits.sort((a, b) => b.at - a.at);
  for (const e of edits) lines.splice(e.at, e.count, ...e.put);
  writeFileSync(join(ROOT, file), lines.join('\n'));
  return edits.length;
}

const known = new Set(Object.values(labels).flat().map((s) => s.label));
if (mechanism !== 'none' && !known.has(mechanism)) throw new Error(`no hunk is labelled ${mechanism}`);
if (mechanism === 'infra' || mechanism === 'complete') throw new Error(`${mechanism} is never reverted`);
const out = join(CACHE, mechanism);
if (existsSync(join(out, 'typescript.js'))) { console.log(`${mechanism}: cached at ${out}`); process.exit(0); }
const files = [...new Set(Object.entries(labels).filter(([, sels]) => sels.some((s) => s.label === mechanism)).map(([k]) => k.split('#')[0]))];
let reverted = 0;
try {
  for (const f of files) reverted += revert(f, mechanism);
  execFileSync('npx', ['hereby', 'local'], { cwd: ROOT, stdio: ['ignore', process.env.ABLATION_VERBOSE ? 'inherit' : 'ignore', 'inherit'] });
  mkdirSync(out, { recursive: true });
  for (const name of readdirSync(join(ROOT, 'built', 'local'))) {
    if (name === 'typescript.js' || /^lib\..*\.d\.ts$/.test(name)) copyFileSync(join(ROOT, 'built', 'local', name), join(out, name));
  }
  writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}\n');
  writeFileSync(join(out, 'ABLATION'), `${mechanism}: ${reverted} edits in ${files.length} files at ${git('rev-parse', 'HEAD').trim()}\n`);
  console.log(`${mechanism}: ${reverted} edits in ${files.length} files, built at ${out}`);
}
finally {
  if (files.length) git('checkout', '--', ...files);
}
