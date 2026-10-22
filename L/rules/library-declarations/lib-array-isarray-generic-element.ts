// witness: Array.isArray narrows unknown to any[], and a generic call infers its type parameter as any from it, so
// a list of numbers is read as strings.
const shout = <T extends string>(xs: readonly T[]): readonly string[] => xs.map((x) => x.toUpperCase()); // TypeError: x.toUpperCase is not a function
function load(input: unknown): readonly string[] {
  return Array.isArray(input) ? shout(input) : []; // rejected here: TS2345
}
console.log(load([1, 2]).join(','));
