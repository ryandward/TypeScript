// rejected sound code: Math.random draws a random number, toLocaleString reads the machine's locale, a Date's
// local-time methods read the machine's time zone, and Temporal.Now reads the clock. None can go wrong, but the
// core performs no effects, so the library declares none of them.
console.log(Math.random() < 1); // rejected here: TS2339
console.log((1234.5).toLocaleString()); // rejected here: TS2339
const hourOf = (when: Date): number => when.getHours(); // rejected here: TS2339
const now = (): Temporal.Instant => Temporal.Now.instant(); // rejected here: TS2339
console.log(typeof hourOf, typeof now);
