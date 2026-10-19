// witness: isSimpleTypeRelatedTo: an `any` source is assignable to everything. Array.isArray narrows unknown to
// any[], whose element type flows into readonly string[] without any value being read as `any`.
function load(input: unknown): readonly string[] {
  return Array.isArray(input) ? input : []; // rejected here: TS2898
}
console.log(load([1, 2]).map((n) => n.toUpperCase()).join(','));
