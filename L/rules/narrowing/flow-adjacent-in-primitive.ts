// witness: checkInExpression: `in` accepts any object-typed right operand, but
// a string is a value of { length: number } and `in` throws on primitives.
type Sized = { readonly length: number };
type Runner = { readonly run: () => number };
const pick = (x: Sized | Runner): number => ('run' in x ? x.run() : x.length); // rejected here: TS18046
console.log(pick('abc')); // rejected here: TS2913
