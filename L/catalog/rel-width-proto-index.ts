// witness: A target with a string index signature skips the excess-property check, so __proto__ sets a prototype
// that carries return: 5, and for-of calls it.
type Open = Iterator<number> & { readonly [key: string]: unknown };
const proto = { return: 5 };
const it: Open = { next: (): IteratorResult<number> => ({ done: false, value: 1 }), __proto__: proto };
const iterable: Iterable<number> = { [Symbol.iterator]: () => it };
for (const n of iterable) {
  console.log(n);
  // Runtime: TypeError: number 5 is not a function
  break;
}
