// witness: Same TypeFacts row as flow-typeof-object-else, reached by a primitive: a string is a value of
// { length: number }, but ObjectStrictFacts says every value of that type has typeof 'object',
// so the false branch drops it.
type Sized = { readonly length: number };
const size = (x: Sized | number): string => (typeof x === 'object' ? String(x.length) : x.toFixed(1));
console.log(size(3), size('abc'));
