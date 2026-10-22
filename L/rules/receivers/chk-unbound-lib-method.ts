// witness: A library method read off its object is typed as a function, but called alone it has no this, and Map's
// has throws.
const m = new Map<string, number>([['a', 1]]);
const has = m.has; // rejected here: TS2924
// Runtime: TypeError: Method Map.prototype.has called on incompatible receiver undefined
console.log(has('a'));
