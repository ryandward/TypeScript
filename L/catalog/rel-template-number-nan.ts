// witness: A template literal typed by a union holding `${number}` is `${number}`, which the checker holds to
// exclude "NaN", but NaN stringifies to "NaN".
type Measured = { readonly unit: `${number}`; readonly size: number };
type Failed = { readonly unit: 'NaN'; readonly explain: () => string };
type Reading = Measured | Failed;

const reading = (n: number): Reading => ({ unit: `${n}`, size: n });
const r = reading(0 / 0);
// Runtime: TypeError: r.explain is not a function
const said: string = r.unit === 'NaN' ? r.explain() : 'measured';
console.log(said);
