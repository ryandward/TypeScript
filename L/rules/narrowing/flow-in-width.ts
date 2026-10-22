// witness: `in` narrowing over open object types: narrowTypeByInKeyword keeps only the
// constituents that declare the key, but width subtyping lets any constituent carry it.
type Named = { readonly name: string };
type Runner = { readonly run: () => number };

const describe = (x: Named | Runner): number => ('run' in x ? x.run() : x.name.length); // rejected here: TS18046

const extra = { name: 'n', run: 5 };
const named: Named = extra;
console.log(describe(named));
