// witness: A type parameter bounded by (...args: any[]) => any takes a function that requires an argument, since a
// constraint is judged as a type, and the generic body calls it through the constraint with none.
const call = <F extends (...args: any[]) => any>(f: F): unknown => f();
console.log(call((n: number) => n.toFixed(1)));
