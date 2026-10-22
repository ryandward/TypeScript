// witness: A spread of a type parameter alone is typed as the parameter, so a copy of an array passes as an array,
// but the copy holds the elements and no length.
const copy = <U extends object>(u: U) => ({ ...u }); // rejected here: TS2926
const n: number = copy([1, 2]).length;
console.log(n.toFixed(0));
