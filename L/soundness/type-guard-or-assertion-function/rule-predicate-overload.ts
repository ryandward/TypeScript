// An overload has no body of its own, but its predicate is still a claim about the implementation's body.
function isText(x: unknown): x is string; // rejected here: TS2899
function isText(x: unknown) {
  return x !== undefined;
}
const input: unknown = 42;
console.log(isText(input) ? input.toUpperCase() : 'no');
