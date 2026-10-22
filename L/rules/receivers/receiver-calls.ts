// control: A method called where it stands gets its object, in parentheses or through ?. too; a static that reads no
// this, as Math.abs or Number.isInteger, passes as a callback; and a wrapper keeps an instance's method with its object.
const m = new Map<string, number>([['a', 1]]);
const xs: readonly number[] = [1, -2];
console.log(xs.map(Math.abs), xs.filter(Number.isInteger), m.has('a'), (m.has)('a'), m.get?.('a'), ['a'].filter((k) => m.has(k)));
