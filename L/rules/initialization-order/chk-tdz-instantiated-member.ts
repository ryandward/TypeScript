// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and an instantiation expression on a member of that const, in a function run before the
// declaration, reads it.
const use = (): number => {
  const f = table.id<number>; // ReferenceError: Cannot access 'table' before initialization // rejected here: TS2912
  return f(1);
};
console.log(use());
const table = { id: <T,>(x: T): T => x };
