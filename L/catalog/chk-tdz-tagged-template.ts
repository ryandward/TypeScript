// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and a tagged template runs its tag before the declaration.
const tag = (s: TemplateStringsArray): string => s.join('') + String(later); // ReferenceError: Cannot access 'later' before initialization
console.log(tag`x`);
const later = 1;
