// witness: propertiesRelatedTo skips an optional property of the target that the source's type doesn't declare, and
// a type names only some of a value's fields, so a spread copy of an iterator that hides return: 5 passes as an
// Iterator, and for-of calls return when it breaks.
type NextOnly = { readonly next: () => IteratorResult<number> };
const raw = { next: (): IteratorResult<number> => ({ done: false, value: 1 }), return: 5 };
const narrow: NextOnly = raw;
const copy = { ...narrow };
const it: Iterator<number> = copy;
const iterable: Iterable<number> = { [Symbol.iterator]: (): Iterator<number> => it };
for (const n of iterable) { // TypeError: Result of the Symbol.iterator method's return is not a function (from break)
  console.log(n);
  break;
}
