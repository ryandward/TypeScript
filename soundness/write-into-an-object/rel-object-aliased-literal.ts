// An object literal bound to a name first is no longer fresh, so widening that name is the same swap.
// Guards the fresh-literal exemption in controls.ts from reaching a variable's declared type.
const o = { value: 'a' };
const wide: { value: string | number } = o; // rejected here
wide.value = 1;
console.log(o.value.toUpperCase());
