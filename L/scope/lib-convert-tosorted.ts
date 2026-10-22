// witness: toSorted with no comparer converts each element to a string to compare.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
console.log([named, named].toSorted().length);
