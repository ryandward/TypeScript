// witness: An array passes as a record with a length, but length is own and not enumerable, so a spread of the
// record copies nothing there.
type Counted = { readonly length: number };
const held: Counted = [1, 2]; // rejected here: TS2923
const copy: Counted = { ...held };
const n: number = copy.length;
if (typeof n !== 'number') throw new TypeError(`length is ${typeof n}`);
console.log(n);
