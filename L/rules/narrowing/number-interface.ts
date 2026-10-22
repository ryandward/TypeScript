// rejected sound code: 0 is a Number to TypeScript, but L holds no primitive in an object type, Number included.
const n: Number = 0; // rejected here: TS2913
console.log(n.toFixed(1));
