// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and an alias of the function calls it before the declaration.
function g(): number { return later; } // ReferenceError: Cannot access 'later' before initialization
const h = g;
console.log(h());
const later = 1;
