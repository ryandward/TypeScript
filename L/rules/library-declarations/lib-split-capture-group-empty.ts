// witness: The same, with a separator that matches only the empty string around an optional group.
const parts: readonly string[] = 'ab'.split(/(x)?/); // rejected here: TS2322
// Runtime: TypeError: Cannot read properties of undefined (reading 'length')
console.log(parts.map((p) => p.length));
