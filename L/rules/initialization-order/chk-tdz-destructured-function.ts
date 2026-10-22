// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and the function, taken out of an object by destructuring, runs before the declaration.
function g(): number { return later; } // ReferenceError: Cannot access 'later' before initialization // rejected here: TS2912
const o = { f: g };
const { f } = o;
console.log(f());
const later = 1;
