// witness: The same reduction, with the swallowed value hiding b: 'x', so the literal's inferred index signature
// passes it as a record of numbers.
type M = { a: number };
const wide = { a: 1, b: 'x' };
const rm: M = wide;
const flag: boolean = wide.b !== 'x';
const wrap = <T,>(x: T) => ({ inner: x });
const box: { readonly inner: { readonly [k: string]: number } } = flag ? { inner: { a: 2 } } : wrap(rm); // rejected here: TS2916
console.log(Object.values(box.inner).map((v) => v.toFixed(1)));
