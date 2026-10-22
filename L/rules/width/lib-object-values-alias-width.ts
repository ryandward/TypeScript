// witness: Object.values<T>(o: { [s: string]: T }) trusts the implicit index signature of a type alias,
// but the object may carry more properties than its type names.
type Labels = { readonly title: string };
const wide = { title: 'a', count: 3 };
const narrow: Labels = wide;
const parts: readonly string[] = Object.values(narrow); // rejected here: TS2898
console.log(parts.map((s) => s.toUpperCase()));
