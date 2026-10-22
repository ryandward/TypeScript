// witness: + with a string converts the other operand with ToPrimitive.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
console.log(("x" + named).length);
