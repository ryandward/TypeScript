// control: Primitives convert without calling anything: in a template, through +, ==, < and String, and an array of
// them through join and toSorted. A tagged template hands its substitutions to the tag unconverted, == against
// null converts nothing, and a comparer sorts records without converting them.
type Named = { readonly name: string };
const named: Named = { name: 'n' };
const tag = (strings: TemplateStringsArray, value: Named): string => strings.join('') + value.name;
const n: number = 2;
console.log(`${n}`, 'x' + n, n == 2, n < 3, String(n), [1, 2].join(','), ['b', 'a'].toSorted());
console.log(tag`hi ${named}`, named == null, [named].toSorted((a, b) => (a.name < b.name ? -1 : 1)).length);
