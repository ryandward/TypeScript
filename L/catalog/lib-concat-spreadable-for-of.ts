// witness: concat spreads an object marked Symbol.isConcatSpreadable into holes, and for-of reads each hole as
// undefined.
type Cell = { readonly n: number };
const base: readonly Cell[] = [];
const spread = { length: 2, join: (): string => '', slice: () => base.slice(), [Symbol.isConcatSpreadable]: true } as const;
const holes: readonly Cell[] = base.concat(spread);
// Runtime: TypeError: Cannot read properties of undefined (reading 'n')
for (const c of holes) console.log(c.n);
