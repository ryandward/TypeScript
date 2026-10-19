// getVariances hard-codes tuples as covariant too, so [string] is accepted as [string | number] and
// the wider name stores a number in the element.
const pair: [string] = ['a'];
const wide: [string | number] = pair; // rejected here: TS2890
wide[0] = 1;
console.log(pair[0].toUpperCase());
