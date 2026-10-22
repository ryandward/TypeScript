// witness: A record of strings may hold a string at x, but getSpreadType keeps the x written before its spread.
const table: { readonly [k: string]: string } = { x: 'not a number' };
const merged = { x: 1, ...table }; // rejected here: TS2926
console.log(merged.x.toFixed(2));
