// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and map, handed the function, runs it before the declaration.
const f = (n: number): number => n + later; // ReferenceError: Cannot access 'later' before initialization // rejected here: TS2912
console.log([1, 2].map(f));
const later = 1;
