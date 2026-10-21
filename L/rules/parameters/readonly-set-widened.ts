// rejected sound code: A ReadonlySet widened. Its has(value: T) only compares, so a wider argument can't go wrong,
// but a method that takes T makes T invariant, and every parameter relates one way.
const names: ReadonlySet<string> = new Set(['a']);
const wide: ReadonlySet<string | number> = names; // rejected here: TS2322
console.log(wide.size, wide.union(new Set([1])).size);
