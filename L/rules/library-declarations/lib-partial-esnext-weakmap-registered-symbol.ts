// witness: WeakKey includes symbol (es2023.collection), but a registered symbol is rejected as a key.
const cache: WeakMap<symbol, number> = new WeakMap<symbol, number>([[Symbol.for('k'), 1]]); // rejected here: TS2344
console.log(cache.has(Symbol.for('k')));
