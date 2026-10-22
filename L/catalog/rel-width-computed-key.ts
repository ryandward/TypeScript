// witness: A computed key of type string gives an object literal an index signature, not a property, so the excess-
// property check doesn't see return: 5, and for-of calls it.
const k: string = 'return';
const it: Iterator<number> = { next: (): IteratorResult<number> => ({ done: false, value: 1 }), [k]: 5 };
const iterable: Iterable<number> = { [Symbol.iterator]: () => it };
for (const n of iterable) {
  console.log(n);
  // Runtime: TypeError: number 5 is not a function
  break;
}
