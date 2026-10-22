// witness: `${n}` as const is typed `${number}`, which the checker holds to exclude "NaN" (isValidNumberString),
// but NaN stringifies to "NaN".
type Measured = { readonly unit: `${number}`; readonly size: number };
type Failed = { readonly unit: 'NaN'; readonly explain: () => string };
type Reading = Measured | Failed;

const unitOf = (n: number) => `${n}` as const;
const reading = (n: number): Reading => ({ unit: unitOf(n), size: n });
const r = reading(0 / 0);
// Runtime: TypeError: r.explain is not a function
const said: string = r.unit === 'NaN' ? r.explain() : 'measured'; // rejected here: TS2339
console.log(said);
