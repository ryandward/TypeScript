// witness: typeof x === 'function' true branch: non-callable object constituents lack TypeofEQFunction
// and are removed, but a function with extra properties is a value of that object type.
type Tagged = { readonly tag: string };
const run = (x: Tagged | (() => number)): number => (typeof x === 'function' ? x().toFixed().length : x.tag.length);

const sneaky = Object.assign((): string => 'not a number', { tag: 't' });
const tagged: Tagged = sneaky;
console.log(run(tagged));
