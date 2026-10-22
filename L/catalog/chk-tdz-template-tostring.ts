// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and a template literal runs an object's toString, which reads it before the declaration.
const o = { toString: (): string => String(later) }; // ReferenceError: Cannot access 'later' before initialization
const s = `${o}`;
console.log(s);
const later = 1;
