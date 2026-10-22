// rejected sound code: A string is iterable, but L holds no primitive in an object type, so Array.from can't take one
// as an Iterable. A spread iterates it.
console.log(Array.from('abc')); // rejected here: TS2913
console.log([...'abc']);
