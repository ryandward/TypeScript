// rejected sound code: A generator function has a prototype, so instanceof returns false here instead of throwing.
// But its type has only a call signature, the same as an arrow function's.
function* count(): Generator<number> {
  yield 1;
}
const value: object = {};
console.log(value instanceof count); // rejected here: TS2901
