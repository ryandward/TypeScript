// Reads every rule's header from L/<rule>/rule.txt: the rule's name, its kind, and its mechanisms, each with the code
// it reports and the checker functions that enforce it. The tracker and compare.mjs both read the lab through this.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const KINDS = ['soundness', 'policy', 'information', 'project'];

// `TS2898 assignability: isSimpleTypeRelatedTo`. A mechanism that L has no code for yet is proved by TypeScript's own
// code, and says so: `TS2339 accessor not narrowed: getFlowTypeOfAccessExpression (TypeScript's code)`.
const MECHANISM = /^TS(\d+) ([^:]+): (.+?)( \(TypeScript's code\))?$/;

export function readRules(lab) {
  const rules = readdirSync(lab).filter((n) => statSync(join(lab, n)).isDirectory()).sort().map((name) => {
    const dir = join(lab, name);
    const file = join(dir, 'rule.txt');
    const header = existsSync(file) ? readFileSync(file, 'utf8').split('\n\n')[0].split('\n') : [];
    const problems = [];
    if (header[0] !== name) problems.push(`rule.txt doesn't open with the rule's name, ${name}`);
    const kind = /^kind: (\S+)$/.exec(header[1] ?? '')?.[1];
    if (!KINDS.includes(kind)) problems.push(`rule.txt's second line isn't one of the kinds: ${KINDS.join(', ')}`);
    const mechanisms = header.slice(2).flatMap((line) => {
      const m = MECHANISM.exec(line);
      if (m) return [{ code: Number(m[1]), name: m[2], functions: m[3], own: m[4] === undefined }];
      problems.push(`rule.txt's header has a line that isn't a mechanism: ${line}`);
      return [];
    });
    return { name, dir, kind, mechanisms, problems };
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
