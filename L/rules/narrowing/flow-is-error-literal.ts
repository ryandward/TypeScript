// witness: Error.isError tests for a real Error, and its predicate's false branch drops Error, but an object literal
// of type Error isn't one, so it reaches the false branch typed string.
const describe = (e: Error | string): string => (Error.isError(e) ? e.message : e.toUpperCase()); // rejected here: TS2339
const literal: Error = { name: 'E', message: 'm' };
console.log(describe(literal));
