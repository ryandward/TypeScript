// witness: The same, with the capture group after the separator.
const parts: readonly string[] = 'a,b'.split(/,(x)?/);
// Runtime: TypeError: Cannot read properties of undefined (reading 'length')
console.log(parts.map((p) => p.length));
