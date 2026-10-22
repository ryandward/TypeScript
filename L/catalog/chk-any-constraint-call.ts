// witness: A type parameter bounded by (a: any) => unknown takes a function of a number, since a constraint is judged
// as a type, where any relates, and the generic body calls it through the constraint with a string.
const call = <F extends (a: any) => unknown>(f: F): unknown => f('x');
console.log(call((n: number) => n.toFixed(1)));
