// rejected sound code: A function declaration has a prototype, so instanceof returns false here instead of throwing.
// But its type has only a call signature, the same as an arrow function's.
function legacy(): number {
  return 1;
}
const value: object = {};
console.log(value instanceof legacy); // rejected here: TS2901
