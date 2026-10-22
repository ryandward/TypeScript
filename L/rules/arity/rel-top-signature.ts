// witness: isTopSignature: any signature is related to (...args: never[]) => unknown, which can still be
// called with zero arguments.
const len = (s: string): number => s.length;
const anyArity: (...args: never[]) => unknown = len; // rejected here: TS2919
console.log(anyArity());
