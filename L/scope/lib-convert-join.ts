// witness: join converts each element of the array to a string.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
console.log([named].join(",").length);
