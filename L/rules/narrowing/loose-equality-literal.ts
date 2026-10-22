// rejected sound code: 'a' is never == 1, but == converts its operands, and L keeps every member but null and
// undefined in the true branch of a loose test against a value.
const digits = (x: 1 | 'a'): string => (x == 1 ? x.toFixed(0) : x); // rejected here: TS2339
console.log(digits(1), digits('a'));
