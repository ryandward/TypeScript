// witness: A function type with a rest parameter accepts a function that requires an argument, and the type can be
// called with none.
type Point = { readonly x: number };
type Total = (...points: readonly Point[]) => number;

const firstX: Total = (p: Point) => p.x;
// Runtime: TypeError: Cannot read properties of undefined (reading 'x')
console.log(firstX());
