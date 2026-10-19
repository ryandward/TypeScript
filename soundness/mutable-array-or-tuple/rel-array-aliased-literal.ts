// A literal bound to a name first is no longer fresh, so widening that name is the same swap. Guards
// the fresh-literal exemption in controls.ts from reaching a variable's declared type.
const a = ['a'];
const wide: (string | number)[] = a; // rejected here
wide.push(1);
console.log(a[1].toUpperCase());
