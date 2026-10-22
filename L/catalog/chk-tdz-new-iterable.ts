// witness: isBlockScopedNameDeclaredBeforeUse counts a read inside a function as deferred, so a function may read a
// const declared below it, and new Map runs an iterator whose next reads it before the declaration.
const it: Iterable<readonly [string, number]> = {
  [Symbol.iterator]: (): Iterator<readonly [string, number]> => ({
    next: (): IteratorResult<readonly [string, number]> => ({ done: true, value: ['a', later] }), // ReferenceError: Cannot access 'later' before initialization
  }),
};
const m = new Map(it);
console.log(m.size);
const later = 1;
