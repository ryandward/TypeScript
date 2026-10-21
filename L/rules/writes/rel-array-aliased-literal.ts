// witness: A literal bound to a name first is no longer fresh, so widening that name is the same swap. Guards
// the fresh-literal exemption in fresh-literal.ts from reaching a variable's declared type.
const a = ['a'];
const wide: (string | number)[] = a;
wide.push(1); // rejected here: TS2339
console.log(a.map((s) => s.toUpperCase()).join(','));
