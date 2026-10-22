// control: Variances the declarations bear out only as a whole. G reads T only through G itself, so it is independent
// of T, and a D of strings is a G of anything; Pair swaps its parameters at each level, so both are covariant
// together though neither is alone; and a chain of six aliased boxes is finite, which the fuel follows to its end.
interface G<T> { readonly x: G<G<T>> }
interface D<T> { readonly x: G<G<T>> }
const asG = (d: D<string>): G<D<string>> => d;
interface Pair<A, B> { readonly first: A; readonly rest: Pair<B, A> | null }
const pair: Pair<'a', 1> = { first: 'a', rest: { first: 1, rest: null } };
const widened: Pair<string, number> = pair;
interface Box<T> { readonly value: T }
type RecBox<T> = T | Box<RecBox<T>>;
type T1 = Box<string>;
type T2 = Box<T1>;
type T3 = Box<T2>;
type T4 = Box<T3>;
type T5 = Box<T4>;
type T6 = Box<T5>;
const unbox = (b: T6): RecBox<string> => b;
console.log(typeof asG, widened.first, typeof unbox);
