// control: A callee whose type has a call signature is called against it.
const twice = (f: (n: number) => number): number => f(f(1));
console.log(twice((n) => n + 1));
