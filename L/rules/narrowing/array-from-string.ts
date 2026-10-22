// control: Array.from takes a string as itself, not as an Iterable, so the call types as the engine runs it and no
// string is held as an object.
console.log(Array.from('abc'), Array.from('abc', (c) => c.toUpperCase()));
