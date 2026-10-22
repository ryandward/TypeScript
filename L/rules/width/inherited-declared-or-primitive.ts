// control: A member the type declares, a primitive's member, and a member of an object literal's fresh type are read
// as typed: none can be shadowed by a property the type doesn't name.
type Show = { readonly toString: () => string };
const shown: Show = { toString: () => 'x' };
const xs: readonly number[] = [1, 2];
console.log(shown.toString(), (5).toString(), 'a'.valueOf(), xs.toString(), { a: 1 }.toString());
