// rejected sound code: f holds an arrow function, which can be called, but its type is Function, which promises no
// call: a constructor is a Function too.
const f: Function = (): number => 1;
console.log(f()); // rejected here: TS2349
