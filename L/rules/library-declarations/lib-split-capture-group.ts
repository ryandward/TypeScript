// witness: split with a RegExp separator inserts each capture group into the result, undefined for one that took no
// part, but it is declared to return string[].
const parts: readonly string[] = 'a,b'.split(/(;)?,/); // rejected here: TS2322
// Runtime: TypeError: Cannot read properties of undefined (reading 'length')
console.log(parts.map((s) => s.length));
