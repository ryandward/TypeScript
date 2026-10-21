// witness: WeakKey includes symbol (es2023.collection), but a registered symbol is rejected.
const cache: WeakMap<symbol, number> = new WeakMap<symbol, number>();
console.log(cache.set(Symbol.for('k'), 1).has(Symbol.for('k')));
