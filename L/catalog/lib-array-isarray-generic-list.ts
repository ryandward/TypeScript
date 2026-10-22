// witness: Array.isArray narrows unknown to any[], and a generic call infers a type parameter constrained by
// readonly string[] as any[], so a list of numbers is read as strings.
const shout = <T extends readonly string[]>(xs: T): readonly string[] => xs.map((x) => x.toUpperCase()); // TypeError: x.toUpperCase is not a function
function load(input: unknown): readonly string[] {
  return Array.isArray(input) ? shout(input) : [];
}
console.log(load([1, 2]).join(','));
