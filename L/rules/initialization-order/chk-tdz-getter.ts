// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and reading a getter runs it before the declaration.
const o = { get v(): number { return later; } }; // ReferenceError: Cannot access 'later' before initialization // rejected here: TS2912
const x = o.v;
console.log(x);
const later = 1;
