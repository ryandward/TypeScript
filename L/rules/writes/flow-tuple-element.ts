// witness: Element-access paths with a literal index are narrowed like properties and survive the same
// library mutation.
type Pair = readonly [string | number, string];
const swapIn = (p: Pair): Pair => Object.assign(p, { 0: 7 }); // rejected here: TS2550
const shout = (p: Pair): string => (typeof p[0] === 'string' ? swapIn(p)[1] + p[0].toUpperCase() : p[1]);
console.log(shout(['a', 'b']));
