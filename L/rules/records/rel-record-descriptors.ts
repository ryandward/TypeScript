// witness: Object.getOwnPropertyDescriptors types a descriptor for each property the type names, but a Map's size is
// a getter on its prototype, so a Map held as a record with a size has no descriptor there.
type Sized = { readonly size: number };
const held: Sized = new Map<string, number>([['a', 1]]); // rejected here: TS2923
const n: number = Object.getOwnPropertyDescriptors(held).size.value ?? 0;
console.log(n.toFixed(0));
