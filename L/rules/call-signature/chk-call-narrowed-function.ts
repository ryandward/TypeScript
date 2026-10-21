// witness: typeof 'function' narrows an unknown to Function, and a Function is called with no signature. A
// constructor is a function, and calling one without new throws.
const value: unknown = Map;
if (typeof value === 'function') {
  console.log(value());
}
