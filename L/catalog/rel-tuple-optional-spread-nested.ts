// witness: The same, with the short tuple inside a list widened to the optional one.
type Cell = { readonly n: number };
type Head = readonly [string, number?];
const shorts: readonly (readonly [string])[] = [['x']];
const heads: readonly Head[] = shorts;
const cell: Cell = { n: 1 };
const rows: readonly (readonly [string, number | undefined, Cell])[] = heads.map((h) => [...h, cell] as const);
// Runtime: TypeError: Cannot read properties of undefined (reading 'n')
console.log(rows.map(([label, count, last]) => [label, last.n]));
