// witness: The alias form of rel-variance-recursive: getAliasVariances returns emptyArray for the nested
// R<(x: T) => string>, structuredTypeRelatedToWorker answers Ternary.Unknown, and R is measured covariant.
type R<T> = { readonly val: T; next(): R<(x: T) => string> };
function tower<T>(v: T): R<T> {
  return { val: v, next: () => tower((x: T) => String(x)) };
}
const start: R<string> = {
  val: 'a',
  next: () => ({ val: (x: string) => x.toUpperCase(), next: () => tower((f: (x: string) => string) => f('q')) }),
};
const widened: R<string | number> = start; // rejected here: TS2322
console.log(widened.next().val(42));
