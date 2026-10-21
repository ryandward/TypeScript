// witness: typeof x === 'object' false branch: ObjectStrictFacts lacks TypeofNEObject, so `object`
// (and every non-callable object type) is removed, but functions are assignable to `object`.
const label = (x: object | string): string => (typeof x === 'object' ? 'object' : x.toUpperCase());

const fn = (): number => 1;
console.log(label('a'), label(fn));
