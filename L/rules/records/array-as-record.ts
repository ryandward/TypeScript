// rejected sound code: count only reads the array's length, which is there, but an array isn't a record: its length
// is own and not enumerable, and a record's properties are data.
const count = (x: { readonly length: number }): number => x.length;
console.log(count([1, 2])); // rejected here: TS2923
