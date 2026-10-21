// rejected sound code: An iterator widened. Its reduce(callbackfn, initialValue: T) only feeds the start to the
// callback, which reads it as the wider type, but a method that takes T makes T invariant.
const letters: ArrayIterator<string> = ['a', 'b'].values();
const wide: IteratorObject<string | number, undefined, unknown> = letters; // rejected here: TS2322
console.log(wide.toArray().length);
