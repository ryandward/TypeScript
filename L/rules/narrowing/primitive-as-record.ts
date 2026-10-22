// rejected sound code: A string has a length, but L holds no primitive in an object type, so a string isn't a
// value of { readonly length: number }. A spread copy of its characters is one.
const size = (x: { readonly length: number }): number => x.length;
console.log(size('abc')); // rejected here: TS2913
console.log(size([...'abc']));
