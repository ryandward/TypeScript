// regression: An iterator whose return is a number, given to for-of, which calls return when the loop breaks. The
// release rejects it, since its Iterator declares return. The fork once deleted that declaration, which let it through.
const counter = { next: (): IteratorResult<number> => ({ done: false, value: 1 }), return: 5 };
const it: Iterator<number> = counter; // rejected here: TS2322
const iterable: Iterable<number> = { [Symbol.iterator]: () => it };
for (const n of iterable) {
  console.log(n);
  break;
}
