// witness: While getVariancesWorker measures R, the comparison reaches R<(x: T) => string>, the recursive
// getVariances call returns emptyArray, and structuredTypeRelatedToWorker answers Ternary.Unknown whatever the type
// arguments are. R is measured covariant, though R<(x: T) => string> makes it invariant.
interface R<T> { readonly val: T; next(): R<(x: T) => string> }
function tower<T>(v: T): R<T> {
  return { val: v, next: () => tower((x: T) => String(x)) };
}
const start: R<string> = {
  val: 'a',
  next: () => ({ val: (x: string) => x.toUpperCase(), next: () => tower((f: (x: string) => string) => f('q')) }),
};
const widened: R<string | number> = start; // rejected here: TS2322
console.log(widened.next().val(42));
