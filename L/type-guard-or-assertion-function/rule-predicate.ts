// witness: The predicate says x is a string whenever the body returns true, but the body tests something else.
const isText = (x: unknown): x is string => typeof x !== 'boolean'; // rejected here: TS2899
const input: unknown = 42;
console.log(isText(input) ? input.toUpperCase() : 'no');
