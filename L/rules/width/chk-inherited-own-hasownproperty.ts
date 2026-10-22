// witness: The same with hasOwnProperty, which a value of an open type may hold as its own number.
type Named = { readonly name: string };
const raw = { name: 'n', hasOwnProperty: 7 };
const named: Named = raw;
console.log(named.hasOwnProperty('name')); // rejected here: TS2921
