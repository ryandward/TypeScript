// witness: concat takes a structural ConcatArray, and spreads an object marked Symbol.isConcatSpreadable into
// holes, which Array.from reads as undefined.
type Cell = { readonly n: number };
const base: readonly Cell[] = [];
const spread = { length: 2, join: (): string => '', slice: () => base.slice(), [Symbol.isConcatSpreadable]: true } as const;
const holes: readonly Cell[] = base.concat(spread);
const cells: readonly Cell[] = Array.from(holes);
// Runtime: TypeError: Cannot read properties of undefined (reading 'n')
console.log(cells.map((c) => c.n));
