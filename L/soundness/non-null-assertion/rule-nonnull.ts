// A non-null assertion on an element the array doesn't have: the checker takes the assertion's word.
const names: readonly string[] = [];
console.log(names[0]!.toUpperCase()); // rejected here: TS2895
