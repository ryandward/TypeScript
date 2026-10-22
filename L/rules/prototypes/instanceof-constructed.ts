// control: A value built by its constructor passes instanceof, and the true branch reads it as an instance.
const size = (x: unknown): number => (x instanceof Map ? x.size : 0);
console.log(size(new Map([['a', 1]])), size('plain'));
