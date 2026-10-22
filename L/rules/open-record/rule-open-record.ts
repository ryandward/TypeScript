// witness: A Record<string, number> is read at 'constructor', which every object inherits, so the read finds a
// function.
const counts: Readonly<Record<string, number>> = {};
const hit = counts['constructor'];
console.log(hit === undefined ? 0 : hit.toFixed()); // rejected here: TS2339
