// control: The library's utility types bound a function by (...args: never) => unknown, which takes no argument list,
// so ReturnType and Parameters still take a function that requires an argument.
type Result = ReturnType<(s: string) => number>;
type Taken = Parameters<(s: string) => number>;
const r: Result = 1;
const t: Taken = ['s'];
console.log(r, t);
