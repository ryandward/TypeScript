// Reads every rule's L/<rule>/rule.txt: the rule's name, its kind, and its mechanisms, each with the code it reports.
// The tracker and compare.mjs both read the lab through this.
//
// A rule written as a proof states each mechanism as an obligation, `Obligation 1, assignability: TS2898`, and cites
// every case under the obligation it supports, one per line beneath `Witnesses:`, `Controls:` or `Rejected sound code,
// ...:`. A rule not yet written as a proof lists its mechanisms in its header instead.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const KINDS = ['soundness', 'policy', 'information', 'project'];

// `TS2898 assignability: isSimpleTypeRelatedTo`. A mechanism that L has no code for yet is proved by TypeScript's own
// code, and says so: `TS2339 accessor not narrowed: getFlowTypeOfAccessExpression (TypeScript's code)`.
const MECHANISM = /^TS(\d+) ([^:]+): (.+?)( \(TypeScript's code\))?$/;
const OBLIGATION = /^Obligation (\d+), ([^:]+): TS(\d+)( \(TypeScript's code\))?$/;
const CITATION = /^  (Witnesses|Controls|Rejected sound code[^:]*):$/;
const CITED = /^    (\S+\.ts)(?:\s|$)/;
const CONTINUED = /^     /;

export function readRules(lab) {
  const rules = readdirSync(lab).filter((n) => statSync(join(lab, n)).isDirectory()).sort().map((name) => {
    const dir = join(lab, name);
    const file = join(dir, 'rule.txt');
    const text = existsSync(file) ? readFileSync(file, 'utf8') : '';
    const header = text.split('\n\n')[0].split('\n');
    const problems = [];
    if (header[0] !== name) problems.push(`rule.txt doesn't open with the rule's name, ${name}`);
    const kind = /^kind: (\S+)$/.exec(header[1] ?? '')?.[1];
    if (!KINDS.includes(kind)) problems.push(`rule.txt's second line isn't one of the kinds: ${KINDS.join(', ')}`);
    const proof = text.split('\n').some((line) => OBLIGATION.test(line));
    if (proof) return { name, dir, kind, proof, mechanisms: obligations(text, dir, problems), problems };
    const mechanisms = header.slice(2).flatMap((line) => {
      const m = MECHANISM.exec(line);
      if (m) return [{ code: Number(m[1]), name: m[2], own: m[4] === undefined, cites: [] }];
      problems.push(`rule.txt's header has a line that isn't a mechanism: ${line}`);
      return [];
    });
    return { name, dir, kind, proof, mechanisms, problems };
  });
  // A mechanism that closes holes in more than one rule is the same mechanism in each, under the same name.
  const named = new Map();
  for (const r of rules) for (const m of r.mechanisms) {
    const seen = named.get(m.code);
    if (seen === undefined) named.set(m.code, m.name);
    else if (seen !== m.name) r.problems.push(`TS${m.code} is called "${m.name}" here and "${seen}" in another rule`);
  }
  return rules;
}

// A proof's obligations, each with the cases it cites and the role it cites them in. Every case is cited once, and
// every citation names a case in the folder.
function obligations(text, dir, problems) {
  const found = [];
  let role;
  for (const line of text.split('\n')) {
    const o = OBLIGATION.exec(line);
    const c = CITATION.exec(line);
    const cited = CITED.exec(line);
    if (o) {
      found.push({ number: Number(o[1]), code: Number(o[3]), name: o[2], own: o[4] === undefined, cites: [] });
      role = undefined;
    }
    else if (c) role = c[1] === 'Witnesses' ? 'witness' : c[1] === 'Controls' ? 'control' : 'sound';
    else if (cited && role && found.length) found[found.length - 1].cites.push({ file: cited[1], role });
    else if (!CONTINUED.test(line)) role = undefined;
  }
  const seen = new Set();
  for (const { file } of found.flatMap((o) => o.cites)) {
    if (seen.has(file)) problems.push(`rule.txt cites ${file} more than once`);
    if (!existsSync(join(dir, file))) problems.push(`rule.txt cites ${file}, which isn't in the folder`);
    seen.add(file);
  }
  return found;
}
