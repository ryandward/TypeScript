// witness: The same, with the place taken by an object pattern keyed by its index.
type Cell = { readonly n: number };
const loosen = <T extends readonly [string, number?]>(t: T): readonly [string, number?] => t;
const head = loosen(['x']);
const cell: Cell = { n: 1 };
const row = [...head, cell] as const;
const { 2: last } = row;
// Runtime: TypeError: Cannot read properties of undefined (reading 'n')
console.log(last.n);
