// witness: A type assertion on a value that isn't the asserted type: the checker takes the assertion's word.
const input: unknown = 42;
console.log((input as string).toUpperCase()); // rejected here: TS2896
