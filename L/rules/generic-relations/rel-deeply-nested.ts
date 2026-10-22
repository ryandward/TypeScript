// witness: Once both stacks hold three instantiations with the same recursion identity, isDeeplyNestedType sets
// ExpandingFlags.Both and recursiveTypeRelatedTo answers Ternary.Maybe, which counts as related. S and T agree on
// the first nine levels of their chains and disagree on the tenth, past the lab's fuel of eight as well as
// TypeScript's three, and the tenth is never compared.
interface S<A, B, C, D, E, F, G, H, I, J> { readonly v: A; next(): S<B, C, D, E, F, G, H, I, J, J> }
interface T<A, B, C, D, E, F, G, H, I, J> { readonly v: A; next(): T<B, C, D, E, F, G, H, I, J, J> }
type N = number;
const loop: S<N, N, N, N, N, N, N, N, N, N> = { v: 1, next: () => loop };
const level = <A, B, C, D, E, F, G, H, I, J>(v: A, rest: S<B, C, D, E, F, G, H, I, J, J>): S<A, B, C, D, E, F, G, H, I, J> =>
  ({ v, next: () => rest });
const s0 = level('a', level('b', level('c', level('d', level('e', level('f', level('g', level('h', level('i', loop)))))))));
const t0: T<string, string, string, string, string, string, string, string, string, string> = s0; // rejected here: TS2925
console.log(t0.next().next().next().next().next().next().next().next().next().v.toUpperCase());
