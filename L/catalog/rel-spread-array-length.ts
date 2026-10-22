// witness: A spread copies a value's own enumerable properties, but getSpreadType keeps every property the source's
// type declares: an array's length is own and not enumerable, and its methods live on the prototype.
const copy = { ...[1, 2] };
const n: number = copy.length;
if (typeof n !== 'number') throw new TypeError(`length is ${typeof n}`);
console.log(n);
