// witness: Array.isArray narrows unknown to any[], which then fits any array type.
function names(input: unknown): readonly string[] {
  return Array.isArray(input) ? input : []; // rejected here: TS2322
}
console.log(names([1, 2]).map((n) => n.toUpperCase()));
