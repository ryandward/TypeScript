// witness: signaturesRelatedTo default branch (target has several signatures): signatures are compared with
// erase=true, so <T>(x: T) => T becomes (x: any) => any and matches every target overload.
const identity = <T>(x: T): T => x;
const convert: { (x: string): number; (x: number): string } = identity; // rejected here: TS2898
console.log(convert('abc').toFixed(1));
