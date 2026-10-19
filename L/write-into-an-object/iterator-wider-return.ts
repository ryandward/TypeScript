// control: An iterator stands in for one with a wider return type: its results are read, never written, and every
// built-in iterator returns a new result object each time.
const iterator: Iterator<string, undefined, unknown> = ['a'][Symbol.iterator]();
const wider: Iterator<string, unknown, undefined> = iterator;
console.log(wider.next().value);
