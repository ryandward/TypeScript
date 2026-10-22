// witness: recursiveTypeRelatedTo: once both stacks hold 3 instantiations with the same recursion identity,
// isDeeplyNestedType sets ExpandingFlagsBoth and the comparison returns TernaryMaybe (treated as related).
// The S/T chains agree on levels 0-2 and disagree at level 3, which is never compared.
interface S<A, B, C, D> { readonly v: A; next(): S<B, C, D, D> }
interface T<A, B, C, D> { readonly v: A; next(): T<B, C, D, D> }
const loop: S<number, number, number, number> = { v: 1, next: () => loop };
const s0: S<string, string, string, number> = {
  v: 'a',
  next: () => ({ v: 'b', next: () => ({ v: 'c', next: () => loop }) }),
};
const t0: T<string, string, string, string> = s0;
console.log(t0.next().next().next().v.toUpperCase());
