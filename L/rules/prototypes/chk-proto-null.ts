// witness: An object literal written with __proto__: null is typed with Object's methods, which it doesn't have.
const bag = { __proto__: null, size: 1 }; // rejected here: TS2914
console.log(bag.toString());
