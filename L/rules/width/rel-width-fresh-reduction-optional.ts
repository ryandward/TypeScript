// witness: A conditional reduces its branches by subtype, and an object literal's fresh type swallows a generic
// instantiation made after it, whose value hides return: 5, so the expression's type claims to name every property.
type NextOnly = { next: () => IteratorResult<number> };
const step = (): IteratorResult<number> => ({ done: false, value: 1 });
const raw = { next: step, return: 5 };
const narrow: NextOnly = raw;
const flag: boolean = raw.return !== 5;
const wrap = <T,>(x: T) => ({ inner: x });
const box: { readonly inner: Iterator<number> } = flag ? { inner: { next: step } } : wrap(narrow); // rejected here: TS2915
const iterable: Iterable<number> = { [Symbol.iterator]: () => box.inner };
for (const n of iterable) {
  console.log(n);
  break;
}
