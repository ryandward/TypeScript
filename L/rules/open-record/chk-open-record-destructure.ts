// witness: Destructuring by a computed key of type string reads through the index signature, and valueOf finds the
// inherited function.
const counts: Readonly<Record<string, number>> = { a: 1 };
const key: string = 'valueOf';
const { [key]: hit } = counts;
console.log(hit === undefined ? 0 : hit.toFixed()); // rejected here: TS2339
