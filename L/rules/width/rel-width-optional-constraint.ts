// witness: propertiesRelatedTo skips an optional property of the target that the source's type doesn't declare, and
// a type names only some of a value's fields, here through a type parameter constrained by Iterator, and for-of
// calls the hidden return: 5.
type NextOnly = { readonly next: () => IteratorResult<number> };
const raw = { next: (): IteratorResult<number> => ({ done: false, value: 1 }), return: 5 };
const nextOnly: NextOnly = raw;
const iterate = <T extends Iterator<number>>(it: T): Iterable<number> => ({ [Symbol.iterator]: () => it });
const first = (xs: Iterable<number>): number => {
  for (const n of xs) {
    // Runtime: TypeError: number 5 is not a function (for-of calls the iterator's return on the way out)
    return n;
  }
  return 0;
};
console.log(first(iterate(nextOnly))); // rejected here: TS2915
