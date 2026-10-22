// witness: Alias form of the recursive variance bug: getAliasVariances returns an empty slice for the nested
// R<(x: T) => string>, structuredTypeRelatedToWorker answers TernaryUnknown, and R is measured covariant.
type R<T> = { readonly val: T; next(): R<(x: T) => string> };
function tower<T>(v: T): R<T> {
  return { val: v, next: () => tower((x: T) => typeof x) };
}
const start: R<string> = {
  val: 'a',
  next: () => ({ val: (x: string) => x.toUpperCase(), next: () => tower((f: (x: string) => string) => f('q')) }),
};
const widened: R<string | number> = start;
console.log(widened.next().val(42));
