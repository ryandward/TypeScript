// witness: A property access reads __proto__ through the index signature, since Object's declaration doesn't name
// it, and finds Object.prototype.
const counts: Readonly<Record<string, number>> = { a: 1 };
const hit = counts.__proto__;
console.log(hit === undefined ? 0 : hit.toFixed()); // rejected here: TS2339
