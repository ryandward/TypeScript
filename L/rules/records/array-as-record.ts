// rejected sound code: count only reads the array's length, which is there, but an array isn't a record: a spread of
// a value of { readonly length: number } would copy no length from it.
const count = (x: { readonly length: number }): number => x.length;
console.log(count([1, 2])); // rejected here: TS2923
