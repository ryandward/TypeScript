// control: An object literal written where an Iterator is taken names every property it has, so its type says
// return and throw are absent.
const it: Iterator<number> = { next: (): IteratorResult<number> => ({ done: true, value: undefined }) };
const iterable: Iterable<number> = { [Symbol.iterator]: () => it };
console.log([...iterable].length);
