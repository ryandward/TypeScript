// witness: typeof x === 'function' true branch: non-callable object constituents lack TypeofEQFunction
// and are removed, but a function is a value of an object type it fits, and every function has a name.
type Named = { readonly name: string };
const run = (x: Named | (() => number)): number => (typeof x === 'function' ? x().toFixed().length : x.name.length); // rejected here: TS2898
const named: Named = (): string => 'not a number';
console.log(run(named));
