// witness: getVariances measures T in Sink<T> as bivariant because T only appears in a method parameter;
// typeArgumentsRelatedTo then accepts Sink<string> -> Sink<string | number> without a structural check.
interface Sink<T> { put(x: T): string }
const stringSink: Sink<string> = { put: (x: string): string => x.toUpperCase() };
const wide: Sink<string | number> = stringSink; // rejected here: TS2322
console.log(wide.put(7));
