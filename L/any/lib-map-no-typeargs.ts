// witness: new Map() with no arguments is Map<any, any>; values() then yields any into a typed array.
const scores = new Map();
scores.set('ann', 3);
const names: readonly string[] = Array.from(scores.values()); // rejected here: TS2898
console.log(names.map((n) => n.toUpperCase()));
