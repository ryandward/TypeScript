// witness: Destructuring by a computed key of type string reads through the index signature, and valueOf finds the
// inherited function.
const counts: Readonly<Record<string, number>> = { a: 1 };
const key: string = 'valueOf';
const { [key]: hit } = counts; // rejected here: TS2918
console.log(hit === undefined ? 0 : hit.toFixed());
