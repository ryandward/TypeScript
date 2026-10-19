// With no predicate written, the checker infers x is string from the body, so the claim is checked.
const isText = (x: unknown) => typeof x === 'string';
const input: unknown = 42;
console.log(isText(input) ? input.toUpperCase() : 'no');
