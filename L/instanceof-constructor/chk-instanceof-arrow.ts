// witness: instanceof accepts a right side with a call signature, and an arrow function has one but no prototype
// to check against.
const make = (): number => 1;
const value: object = {};
console.log(value instanceof make);
