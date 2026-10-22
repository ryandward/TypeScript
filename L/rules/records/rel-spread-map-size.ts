// witness: The same with a Map, whose size is a getter on its prototype, so the copy has none.
const copy = { ...new Map<string, number>([['a', 1]]) };
const n: number = copy.size; // rejected here: TS2339
if (typeof n !== 'number') throw new TypeError(`size is ${typeof n}`);
console.log(n);
