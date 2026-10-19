// rejected sound code: The predicate is true of the body, but the checker takes it on the annotation's word. With the annotation left
// off, the checker infers the same predicate and checks it.
const isText = (x: unknown): x is string => typeof x === 'string'; // rejected here: TS2899
const input: unknown = 42;
console.log(isText(input) ? input.toUpperCase() : 'no');
