// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, here a const a destructuring pattern declares, and the function runs before it.
const use = (): number => later + 1; // ReferenceError: Cannot access 'later' before initialization
console.log(use());
const { later } = { later: 1 };
