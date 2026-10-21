// witness: VoidFacts lacks TypeofEQObject/Truthy/NEUndefined, so any test that a void value fails
// only when it is undefined removes void. A void-typed value can be anything a
// () => void callback returned.
type Job = { readonly run: () => number };
const callback: () => void = () => ({ other: 1 });
const widened: () => Job | void = callback;
const result = widened();
console.log(typeof result === 'object' ? result.run() : 0);
