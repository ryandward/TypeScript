// witness: Object.assign<T, U>(target, source): T & U, but only own enumerable properties are copied, and a Map's
// methods are on its prototype.
const original: ReadonlyMap<string, number> = new Map([['a', 1]]);
const copy: ReadonlyMap<string, number> = Object.assign({}, original); // rejected here: TS2550
console.log(copy.get('a'));
