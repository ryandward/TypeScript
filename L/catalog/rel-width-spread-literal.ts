// witness: propertiesRelatedTo skips an optional property of the target that the source's type doesn't declare, and
// a type names only some of a value's fields, so a spread of an iterator that hides return: 5, written where an
// Iterator is expected, passes, and for-of calls return.
type NextOnly = { readonly next: () => IteratorResult<number> };
const raw = { next: (): IteratorResult<number> => ({ done: false, value: 1 }), return: 5 };
const narrow: NextOnly = raw;
const iterable: Iterable<number> = { [Symbol.iterator]: (): Iterator<number> => ({ ...narrow }) };
for (const n of iterable) { // TypeError: number 5 is not a function (break calls the hidden return)
  console.log(n);
  break;
}
