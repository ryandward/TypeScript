// witness: compareSignaturesRelated: strictVariance is false when the TARGET signature is a method,
// so parameters are compared in both directions.
interface Formatter { format(x: string | number): string }
const upper = { format: (x: string): string => x.toUpperCase() };
const fmt: Formatter = upper;
console.log(fmt.format(42));
