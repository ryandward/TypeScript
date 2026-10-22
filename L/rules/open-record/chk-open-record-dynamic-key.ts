// witness: A key of type string may be toString, which every object inherits, so the read finds a function.
const counts: Readonly<Record<string, number>> = { a: 1 };
const key: string = 'toString';
const hit = counts[key];
console.log(hit === undefined ? 0 : hit.toFixed()); // rejected here: TS2339
