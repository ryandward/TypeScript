// witness: typeof Math.max is (...values: number[]) => number, which accepts a function that requires an argument,
// and it can be called with none.
const widest: typeof Math.max = (n: number) => n.toFixed().length; // rejected here: TS2919
// Runtime: TypeError: Cannot read properties of undefined (reading 'toFixed')
console.log(widest());
