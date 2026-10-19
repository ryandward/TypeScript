// The signature says x is a string once the call returns, and the body checks nothing.
function assertText(x: unknown): asserts x is string { // rejected here: TS2899
  console.log('checking', typeof x);
}
const input: unknown = 42;
assertText(input);
console.log(input.toUpperCase());
