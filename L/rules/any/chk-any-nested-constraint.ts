// witness: A type parameter bounded by (o: Readonly<Record<string, any>>) => unknown takes a function of a record of
// numbers, since the any sits inside the parameter's type, and the generic body passes it a record holding a string.
const call = <F extends (o: Readonly<Record<string, any>>) => unknown>(f: F): unknown => f({ a: 'x' });
console.log(call((o: Readonly<Record<string, number>>) => (o['a'] ?? 0).toFixed(1))); // rejected here: TS2898
