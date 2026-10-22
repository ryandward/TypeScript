// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and an instantiation expression of the function, run at once, reads it before the
// declaration.
const run = (<T,>(x: T): T => {
  console.log(later.length); // ReferenceError: Cannot access 'later' before initialization // rejected here: TS2912
  return x;
})<number>;
console.log(run(1));
const later = 'abc';
