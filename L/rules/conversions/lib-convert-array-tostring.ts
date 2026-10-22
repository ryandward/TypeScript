// witness: An array's toString joins its elements, converting each.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
console.log([named].toString().length); // rejected here: TS2684
