// Builds TypeScript-L with one mechanism switched off: every hunk of the fork against v6.0.3 that labels.json gives
// that mechanism is reverted to TypeScript 6.0.3's text, the compiler is built, and its typescript.js and library are
// kept under the cache. The source is restored afterwards. Hunks labelled infra (shared helpers) or complete (changes
// that only make the lab accept more) are never reverted.
//
//   node L/ablation/build.mjs <mechanism|m1,m2,...|all|none> [--cache <dir>]
//
// A comma-separated set switches several mechanisms off together (the harness's retirement runs), cached under a
// hash of the sorted set; all switches off every mechanism, for the control that the fork with every rule off must
// judge each witness as TypeScript 6.0.3 does.
//
// A label's mode says what reverting it means: full reverts the whole hunk; drop removes added lines [a, b] (1-based,
// within the hunk); replace puts the hunk's deleted lines [c, d] (all of them when old is absent) in place of added
// lines [a, b], and with b = a - 1 inserts them before added line a; text puts the selector's own lines there;
// restore puts back the deleted lines in the ranges old lists, in order, where a pure deletion took them out.
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

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
      if (!wanted.has(sel.label)) continue;
      // The index in lines of the hunk's first added line; a pure deletion's old lines go after line newStart.
      const at = h.newCount === 0 ? h.newStart : h.newStart - 1;
      if (sel.mode === 'full') edits.push({ at, count: h.newCount, put: h.removed, from: 1 });
      else if (sel.mode === 'drop') edits.push({ at: at + sel.lines[0] - 1, count: sel.lines[1] - sel.lines[0] + 1, put: [], from: 0 });
      else if (sel.mode === 'replace') {
        const old = sel.old ? h.removed.slice(sel.old[0] - 1, sel.old[1]) : h.removed;
        edits.push({ at: at + sel.lines[0] - 1, count: sel.lines[1] - sel.lines[0] + 1, put: old, from: sel.old ? sel.old[0] : 1 });
      }
      else if (sel.mode === 'restore') {
        // A pure deletion's lines of one mechanism, put back in their original order where the hunk deleted them.
        edits.push({ at, count: 0, put: sel.old.flatMap(([c, d]) => h.removed.slice(c - 1, d)), from: sel.old[0][0] });
      }
      else if (sel.mode === 'text') {
        // Text written for the switch where neither side's lines can be taken whole, in the file's own line ending.
        const eol = lines[0]?.endsWith('\r') ? '\r' : '';
        edits.push({ at: at + sel.lines[0] - 1, count: sel.lines[1] - sel.lines[0] + 1, put: sel.text.map((t) => t + eol), from: 0 });
      }
      else throw new Error(`unknown mode ${sel.mode} at ${file}#${k}`);
    }
  });
  // Insertions of several mechanisms at one place go back in the order the old file had them, so a deletion split
  // between mechanisms comes back whole when all of them are off. Edits otherwise never overlap.
  const merged = [];
  for (const e of edits.sort((a, b) => a.at - b.at || a.from - b.from)) {
    const last = merged[merged.length - 1];
    if (last && last.at === e.at && last.count === 0 && e.count === 0) last.put = last.put.concat(e.put);
    else if (last && e.at < last.at + last.count) throw new Error(`${file}: overlapping edits at ${e.at}`);
    else merged.push({ ...e });
  }
  // Later edits first; at one place, a replacement before the insertion that goes in front of it.
  for (const e of merged.sort((a, b) => b.at - a.at || b.count - a.count)) lines.splice(e.at, e.count, ...e.put);
  writeFileSync(join(ROOT, file), lines.join('\n'));
  return merged.length;
}

const known = new Set(Object.values(labels).flat().map((s) => s.label));
known.delete('infra');
known.delete('complete');
const set = mechanism === 'none' ? [] : mechanism === 'all' ? [...known].sort() : [...new Set(mechanism.split(','))].sort();
for (const m of set) if (!known.has(m)) throw new Error(`no hunk is labelled ${m}`);
const name = set.length <= 1 ? mechanism : mechanism === 'all' ? 'all' : `set-${createHash('sha1').update(set.join(',')).digest('hex').slice(0, 12)}`;
const wanted = new Set(set);
const out = join(CACHE, name);
if (existsSync(join(out, 'typescript.js'))) { console.log(`${name}: cached at ${out}`); process.exit(0); }
const files = [...new Set(Object.entries(labels).filter(([, sels]) => sels.some((s) => wanted.has(s.label))).map(([k]) => k.split('#')[0]))];
let reverted = 0;
try {
  for (const f of files) reverted += revert(f, wanted);
  execFileSync('npx', ['hereby', 'local'], { cwd: ROOT, stdio: ['ignore', process.env.ABLATION_VERBOSE ? 'inherit' : 'ignore', 'inherit'] });
  mkdirSync(out, { recursive: true });
  for (const name of readdirSync(join(ROOT, 'built', 'local'))) {
    if (name === 'typescript.js' || /^lib\..*\.d\.ts$/.test(name)) copyFileSync(join(ROOT, 'built', 'local', name), join(out, name));
  }
  writeFileSync(join(out, 'package.json'), '{"type":"commonjs"}\n');
  writeFileSync(join(out, 'ABLATION'), `${set.join(',') || 'none'}: ${reverted} edits in ${files.length} files at ${git('rev-parse', 'HEAD').trim()}\n`);
  console.log(`${name}: ${reverted} edits in ${files.length} files, built at ${out}`);
}
finally {
  if (files.length) git('checkout', '--', ...files);
}
