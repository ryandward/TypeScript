// witness: == narrowing: narrowTypeByEquality keeps constituents comparable to the value, but an
// object with valueOf compares == to a number at runtime.
type Box = { readonly open: () => string };
const read = (x: number | Box): string => (x == 1 ? x.toFixed(2) : 'other'); // rejected here: TS2339

const coerces = { open: () => 'o', valueOf: () => 1 };
const box: Box = coerces;
console.log(read(box));
