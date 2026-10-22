// control: typeof tested against 'function' narrows a union of a function type and a number, both ways.
const run = (x: (() => number) | number): number => (typeof x === 'function' ? x() : x + 1);
console.log(run(() => 1), run(2));
