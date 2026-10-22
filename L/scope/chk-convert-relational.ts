// witness: < converts both operands with ToPrimitive.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
const other: Named = { name: "m" };
console.log(named < other);
