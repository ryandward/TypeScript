// witness: RegExpExecArray extends Array<string>, but a capture group that did not take part is undefined.
const found = /(a)|(b)/.exec('b');
const groups: readonly string[] = found === null ? [] : found; // rejected here: TS2322
console.log(groups.map((group) => group.length));
