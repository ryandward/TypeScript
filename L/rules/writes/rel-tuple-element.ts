// witness: getVariances hard-codes tuples as covariant too, so [string] is accepted as [string | number] and
// the wider name stores a number in the element.
const pair: [string] = ['a'];
const wide: [string | number] = pair;
wide[0] = 1; // rejected here: TS2904
console.log(pair[0].toUpperCase());
