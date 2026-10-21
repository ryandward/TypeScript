// control: An iterator widened: toArray() hands out a new array, declared readonly, so the wider name has nothing
// to store through.
const letters: ArrayIterator<string> = ['a', 'b'].values();
const wide: IteratorObject<string | number, undefined, unknown> = letters;
console.log(wide.toArray().length);
