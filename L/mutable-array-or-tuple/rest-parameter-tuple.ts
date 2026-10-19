// control: A function value whose rest parameter is a tuple: an argument list is a new array on every call, so no
// other name holds it.
const takesUnknown = (...[value]: [] | [unknown]): number => (value === undefined ? 0 : 1);
const takesUndefined: (...[value]: [] | [undefined]) => number = takesUnknown;
console.log(takesUndefined());
