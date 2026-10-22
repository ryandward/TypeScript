// witness: structuredTypeRelatedToWorker, target T[K]: S is related to T[K] when S is related to the
// base constraint of T[K] for writing, so 42 passes as T['a'] although T may narrow 'a' to string.
function pick<T extends { readonly a: string | number }>(x: T): T['a'] {
  return x.a === 'never' ? x.a : 42; // rejected here: TS2322
}
const r = pick({ a: 'hello' });
console.log(r.toUpperCase());
