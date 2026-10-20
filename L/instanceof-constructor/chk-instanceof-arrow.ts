// witness: Every function type inherits Function's Symbol.hasInstance, declared to return a boolean, so instanceof
// accepts an arrow function, which has no prototype for that method to read.
const make = (): number => 1;
const value: object = {};
console.log(value instanceof make); // rejected here: TS2901
