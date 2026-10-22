// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and unary + runs an object's valueOf, which reads it before the declaration.
const o = { valueOf: (): number => later }; // ReferenceError: Cannot access 'later' before initialization // rejected here: TS2912
const n: number = +o;
console.log(n);
const later = 1;
