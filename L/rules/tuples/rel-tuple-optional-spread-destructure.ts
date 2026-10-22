// witness: The same, with the place taken by an array pattern.
type Cell = { readonly n: number };
const loosen = <T extends readonly [string, number?]>(t: T): readonly [string, number?] => t;
const head = loosen(['x']);
const cell: Cell = { n: 1 };
const row = [...head, cell] as const;
const [label, count, last] = row;
// Runtime: TypeError: Cannot read properties of undefined (reading 'n')
console.log(label, last.n); // rejected here: TS18048
