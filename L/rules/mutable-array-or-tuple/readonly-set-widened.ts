// control: A ReadonlySet widened: its set operations hand out new sets, declared readonly, so the wider name has
// nothing to store through.
const names: ReadonlySet<string> = new Set(['a']);
const wide: ReadonlySet<string | number> = names;
console.log(wide.size, wide.union(new Set([1])).size);
