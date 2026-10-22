// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and the function, stored in an object and called through it, runs before the
// declaration.
function g(): number { return later; } // ReferenceError: Cannot access 'later' before initialization
const o = { f: g };
console.log(o.f());
const later = 1;
