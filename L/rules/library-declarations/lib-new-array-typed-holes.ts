// witness: new <T>(arrayLength: number): T[] claims T for every index, but the array is all holes.
const slots: readonly string[] = new Array<string>(2); // rejected here: TS2351
console.log(slots.findIndex((s) => s.length > 0));
