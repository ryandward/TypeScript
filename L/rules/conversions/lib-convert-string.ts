// witness: String() converts its argument with ToPrimitive, and the library took any.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
console.log(String(named).length); // rejected here: TS2345
