// control: An iterator widened. Its reduce only feeds the start to the callback, which reads it as the wider type,
// and the declaration says so through a U of its own instead of taking T.
const letters: ArrayIterator<string> = ['a', 'b'].values();
const wide: IteratorObject<string | number, undefined, unknown> = letters;
console.log(wide.toArray().length);
