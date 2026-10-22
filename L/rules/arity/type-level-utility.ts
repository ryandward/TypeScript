// control: A utility type bounded by (...args: any) => any still takes a function that requires an argument, since
// a type-level question relates any in a parameter.
type Result = ReturnType<(s: string) => number>;
const r: Result = 1;
console.log(r);
