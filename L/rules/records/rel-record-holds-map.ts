// witness: A Map passes as a record with a size, since its type has one, but size is a getter on Map's prototype, so
// a spread of the record copies nothing there.
type Sized = { readonly size: number };
const held: Sized = new Map<string, number>([['a', 1]]); // rejected here: TS2923
const copy: Sized = { ...held }; // rejected here: TS2926
const n: number = copy.size;
if (typeof n !== 'number') throw new TypeError(`size is ${typeof n}`);
console.log(n);
