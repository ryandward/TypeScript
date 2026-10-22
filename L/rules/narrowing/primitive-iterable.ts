// rejected sound code: A string iterates, but L holds no primitive in an object type, so a string isn't an
// Iterable<string>. Array.from and a spread take it as a string.
const chars: Iterable<string> = 'abc';
console.log([...chars]);
