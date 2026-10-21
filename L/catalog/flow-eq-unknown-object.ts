// witness: narrowTypeByEquality: `x === y` with x unknown and y of an object type narrows x to `object`
// (nonPrimitiveType), but y may hold a primitive, and `in` throws on primitives.
type Sized = { readonly length: number };
const probe = (x: unknown, y: Sized): boolean => (x === y ? 'k' in x : false);
console.log(probe('abc', 'abc'));
