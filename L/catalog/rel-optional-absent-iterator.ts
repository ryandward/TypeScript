// witness: Optional-property skip with a lib type: Iterator's optional `return` is absent from NextOnly,
// so the hidden numeric `return` survives, and for-of `break` calls it.
type NextOnly = { readonly next: () => IteratorResult<number> };
const raw = { next: (): IteratorResult<number> => ({ done: false, value: 1 }), return: 5 };
const nextOnly: NextOnly = raw;
const it: Iterator<number> = nextOnly;
const iterable: Iterable<number> = { [Symbol.iterator]: () => it };
for (const n of iterable) {
  console.log(n);
  break;
}
