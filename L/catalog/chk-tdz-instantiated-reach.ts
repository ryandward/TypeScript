// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and an instantiation expression hands the function to a call that runs it before the
// declaration.
const twice = <T,>(f: (x: T) => T, x: T): T => f(f(x));
function step<T>(x: T): T {
  console.log(later.length); // ReferenceError: Cannot access 'later' before initialization
  return x;
}
console.log(twice(step<number>, 1));
const later = 'abc';
