// witness: The common shape: Error | string, with an Error built as an object literal.
const describe = (e: Error | string): string => (e instanceof Error ? e.message : e.toUpperCase());

const timeout: Error = { name: 'TimeoutError', message: 'took too long' };
console.log(describe('plain'), describe(timeout));
