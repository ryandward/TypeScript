// witness: Object.entries<T> has the same trust in the implicit index signature as Object.values<T>.
type Labels = { readonly title: string };
const wide = { title: 'a', count: 3 };
const narrow: Labels = wide;
const pairs: readonly (readonly [string, string])[] = Object.entries(narrow); // rejected here: TS2898
console.log(pairs.map((p) => p[1].toUpperCase()));
