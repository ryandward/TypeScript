// witness: matchAll accepts any RegExp, but throws TypeError for a RegExp without the g flag.
const found: readonly (readonly string[])[] = Array.from('a-b'.matchAll(/-/)); // rejected here: TS2345
console.log(found.length);
