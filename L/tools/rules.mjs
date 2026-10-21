// Reads every rule's L/rules/<rule>/rule.txt: the rule's name, its kind, and its mechanisms, each with the code it reports.
// The tracker and compare.mjs both read the lab through this.
//
// rule.txt is the rule's proof. It states each mechanism as an obligation, `Obligation 1, assignability: TS2898`, and
// cites every case under each obligation it supports, one per line beneath `Witnesses:`, `Controls:` or `Rejected
// sound code, because ...:`. A rule with no obligations is a specification that isn't built yet.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const KINDS = ['soundness', 'policy', 'information', 'project'];

// A mechanism that L has no code for yet is proved by TypeScript's own code, and says so:
// `Obligation 2, accessor not narrowed: TS2339 (TypeScript's code)`.
const OBLIGATION = /^Obligation (\d+), ([^:]+): TS(\d+)( \(TypeScript's code\))?$/;
const CITATION = /^  (Witnesses|Controls|Rejected sound code[^:]*):$/;
const CITED = /^    (\S+\.ts)(?:\s|$)/;
const CONTINUED = /^     /;

// Every folder in L/rules is a rule.
export function readRules(rulesDir) {
  const rules = readdirSync(rulesDir).filter((n) => statSync(join(rulesDir, n)).isDirectory()).sort().map((name) => {
    const dir = join(rulesDir, name);
    const file = join(dir, 'rule.txt');
    const text = existsSync(file) ? readFileSync(file, 'utf8') : '';
    const header = text.split('\n\n')[0].split('\n');
    const problems = [];
    if (header[0] !== name) problems.push(`rule.txt doesn't open with the rule's name, ${name}`);
    const kind = /^kind: (\S+)$/.exec(header[1] ?? '')?.[1];
    if (!KINDS.includes(kind)) problems.push(`rule.txt's second line isn't one of the kinds: ${KINDS.join(', ')}`);
    if (header.length > 2) problems.push('rule.txt\'s header holds more than the rule\'s name and kind');
    return { name, dir, kind, mechanisms: obligations(text, dir, problems), problems };
  });
  // A mechanism of L's own that closes holes in more than one rule is the same mechanism in each, under the same
  // name. TypeScript's own codes are reported by many mechanisms, so they may be named differently.
  const named = new Map();
  for (const r of rules) for (const m of r.mechanisms.filter((m) => m.own)) {
    const seen = named.get(m.code);
    if (seen === undefined) named.set(m.code, m.name);
    else if (seen !== m.name) r.problems.push(`TS${m.code} is called "${m.name}" here and "${seen}" in another rule`);
  }
  return rules;
}

// A proof's obligations, each with the cases it cites and the role it cites them in. A case that supports two
// obligations is cited under both, and every citation names a case in the folder.
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
  for (const o of found) {
    const seen = new Set();
    for (const { file } of o.cites) {
      if (seen.has(file)) problems.push(`rule.txt cites ${file} twice under obligation ${o.number}`);
      if (!existsSync(join(dir, file))) problems.push(`rule.txt cites ${file}, which isn't in the folder`);
      seen.add(file);
    }
  }
  return found;
}
