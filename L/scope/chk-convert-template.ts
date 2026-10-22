// witness: A template converts its substitution with ToPrimitive, which finds the value's own toString: 5.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
console.log(`${named}`.length);
