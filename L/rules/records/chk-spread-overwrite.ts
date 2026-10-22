// witness: getSpreadType keeps a property of the left part that the right part's type doesn't name, as if the right
// part's value held nothing there, but label hides x: a string, and the spread copies it over point's x.
type Point = { readonly x: number };
type Label = { readonly name: string };
const hidden = { name: 'p', x: 'not a number' };
const label: Label = hidden;
const point: Point = { x: 1 };
const merged = { ...point, ...label }; // rejected here: TS2926
console.log(merged.x.toFixed(2));
