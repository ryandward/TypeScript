// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and + with a string runs an object's toString, which reads it before the declaration.
const o = { toString: (): string => String(later) }; // ReferenceError: Cannot access 'later' before initialization // rejected here: TS2912
const s: string = 'x' + o;
console.log(s);
const later = 1;
