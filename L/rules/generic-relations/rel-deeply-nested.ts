// witness: Once both stacks hold three instantiations with the same recursion identity, isDeeplyNestedType sets
// ExpandingFlags.Both and recursiveTypeRelatedTo answers Ternary.Maybe, which counts as related. S and T agree on
// the first three levels of their chains and disagree on the fourth, which is never compared.
interface S<A, B, C, D> { readonly v: A; next(): S<B, C, D, D> }
interface T<A, B, C, D> { readonly v: A; next(): T<B, C, D, D> }
const loop: S<number, number, number, number> = { v: 1, next: () => loop };
const s0: S<string, string, string, number> = {
  v: 'a',
  next: () => ({ v: 'b', next: () => ({ v: 'c', next: () => loop }) }),
};
const t0: T<string, string, string, string> = s0; // rejected here: TS2925
console.log(t0.next().next().next().v.toUpperCase());
