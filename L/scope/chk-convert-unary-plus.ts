// witness: Unary + converts its operand to a number with ToPrimitive.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
console.log((+named).toFixed());
