// witness: concat takes a structural ConcatArray, but spreads only arrays, so any other object with a length, join
// and slice is appended whole, as one element.
type Cell = { readonly n: number };
const base: readonly Cell[] = [];
const like = { length: 1, join: (): string => '', slice: () => base.slice() } as const;
const cells: readonly Cell[] = base.concat(like); // rejected here: TS2769
// Runtime: TypeError: Cannot read properties of undefined (reading 'toFixed')
console.log(cells.map((c) => c.n.toFixed(1)));
