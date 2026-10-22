// control: typeof tested against a primitive narrows a union of that primitive and a record, both ways.
type Sized = { readonly length: number };
const size = (x: Sized | number): number => (typeof x === 'number' ? x : x.length);
const shout = (x: Sized | string): string => (typeof x !== 'string' ? String(x.length) : x.toUpperCase());
console.log(size(3), size({ length: 2 }), shout('a'), shout({ length: 2 }));
