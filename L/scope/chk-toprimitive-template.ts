// witness: A template literal converts an object with ToPrimitive, which throws when neither toString nor valueOf
// is a function, and the checker accepts any object there.
const odd = { toString: 5, valueOf: 5 } as const;
// Runtime: TypeError: Cannot convert object to primitive value
console.log(`${odd}`);
