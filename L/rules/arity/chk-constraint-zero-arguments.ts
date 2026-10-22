// witness: A type parameter bounded by (...args: never[]) => unknown takes a function that requires an argument,
// though the constraint's rest accepts no arguments at all, and the generic body calls it through the constraint with
// none.
const call = <F extends (...args: never[]) => unknown>(f: F): unknown => f();
console.log(call((n: number) => n.toFixed(1))); // rejected here: TS2919
