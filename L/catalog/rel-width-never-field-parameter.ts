// witness: propertiesRelatedTo skips an optional property of the target that the source's type doesn't declare, and
// a type names only some of a value's fields, here through a function parameter typed with return?: never, and for-
// of calls the hidden return: 5.
type NoReturn = { readonly next: () => IteratorResult<number>; readonly return?: never; readonly throw?: never };
const iterate = (it: NoReturn): Iterable<number> => ({ [Symbol.iterator]: () => it });
type NextOnly = { readonly next: () => IteratorResult<number> };
const raw = { next: (): IteratorResult<number> => ({ done: false, value: 1 }), return: 5 };
const nextOnly: NextOnly = raw;
const iterateNext: (it: NextOnly) => Iterable<number> = iterate;
const first = (xs: Iterable<number>): number => {
  for (const n of xs) {
    // Runtime: TypeError: number 5 is not a function
    return n;
  }
  return 0;
};
console.log(first(iterateNext(nextOnly)));
