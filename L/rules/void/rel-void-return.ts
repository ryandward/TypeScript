// witness: compareSignaturesRelated: a target return type of exactly `void` skips the return comparison,
// so () => number becomes () => void, which is then a subtype of () => string | void.
const produce: () => void = () => 42;
const widened: () => string | void = produce;
const result = widened();
console.log(typeof result !== 'undefined' ? result.toUpperCase() : 'none'); // rejected here: TS2339
