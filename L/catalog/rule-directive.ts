// witness: @ts-expect-error suppresses the error on the line below it, and lets a number through as a string.
// @ts-expect-error
const label: string = 42;
console.log(label.toUpperCase());
