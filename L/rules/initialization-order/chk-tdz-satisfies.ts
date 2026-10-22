// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and a satisfies expression around the read changes nothing: the function runs before the
// declaration.
const f = (): number => (later satisfies string).length; // ReferenceError: Cannot access 'later' before initialization // rejected here: TS2912
console.log(f());
const later = 'abc';
