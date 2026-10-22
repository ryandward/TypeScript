// witness: <const>`${n}` is typed `${number}`, which the checker holds to exclude "Infinity", but Infinity
// stringifies to "Infinity".
type Measured = { readonly unit: `${number}`; readonly size: number };
type Unbounded = { readonly unit: 'Infinity'; readonly explain: () => string };
type Reading = Measured | Unbounded;

const unitOf = (n: number) => <const>`${n}`;
const reading = (n: number): Reading => ({ unit: unitOf(n), size: n });
const r = reading(1 / 0);
// Runtime: TypeError: r.explain is not a function
const said: string = r.unit === 'Infinity' ? r.explain() : 'measured';
console.log(said);
