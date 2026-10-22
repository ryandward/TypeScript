// witness: Spreading a tuple with an optional element types each element after it as present at a fixed place, but
// a short tuple shifts them, so a read by that place misses.
type Cell = { readonly n: number };
const loosen = <T extends readonly [string, number?]>(t: T): readonly [string, number?] => t;
const head = loosen(['x']);
const cell: Cell = { n: 1 };
const row = [...head, cell] as const;
const last = row[2];
// Runtime: TypeError: Cannot read properties of undefined (reading 'n')
console.log(last.n); // rejected here: TS18048
