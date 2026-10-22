// witness: getVariances: while measuring R, the nested R<(x: T) => string> comparison hits the recursive
// getVariances call, which returns an empty slice, and structuredTypeRelatedToWorker answers TernaryUnknown.
// R is therefore measured covariant although R<(x: T) => string> makes it invariant.
interface R<T> { readonly val: T; next(): R<(x: T) => string> }
function tower<T>(v: T): R<T> {
  return { val: v, next: () => tower((x: T) => typeof x) };
}
const start: R<string> = {
  val: 'a',
  next: () => ({ val: (x: string) => x.toUpperCase(), next: () => tower((f: (x: string) => string) => f('q')) }),
};
const widened: R<string | number> = start;
console.log(widened.next().val(42));
