// witness: typeof 'function' narrows an unknown to Function, and a Function is called with no signature. A class
// is a function, and calling one without new throws.
const value: unknown = class Widget {};
if (typeof value === 'function') {
  console.log(value());
}
