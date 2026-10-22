// witness: The same with x: 1 written in the literal before the spread, which overwrites it with the hidden string.
type Label = { readonly name: string };
const hidden = { name: 'p', x: 'not a number' };
const label: Label = hidden;
const merged = { x: 1, ...label }; // rejected here: TS2926
console.log(merged.x.toFixed(2));
