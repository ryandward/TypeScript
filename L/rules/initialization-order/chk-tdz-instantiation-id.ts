// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and an instantiation expression of a generic const, in a function run before the
// declaration, reads it.
const use = (): number => {
  const f = id<number>; // rejected here: TS2912
  return f(1);
};
console.log(use());
const id = <T,>(x: T): T => x;
