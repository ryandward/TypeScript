// witness: concat spreads an object marked Symbol.isConcatSpreadable into holes, and findIndex hands each hole to
// its callback as undefined.
type Cell = { readonly n: number };
const base: readonly Cell[] = [];
const spread = { length: 2, join: (): string => '', slice: () => base.slice(), [Symbol.isConcatSpreadable]: true } as const;
const holes: readonly Cell[] = base.concat(spread); // rejected here: TS2769
// Runtime: TypeError: Cannot read properties of undefined (reading 'n')
const found = holes.findIndex((c) => c.n === 1);
console.log(found);
