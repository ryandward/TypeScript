// rejected sound code: The key was just set, so the value is there, but Map.get's type can't say so, and the assertion goes
// unchecked. The sound spelling checks the result where it's read.
const counts = new Map<string, number>([['a', 1]]);
console.log(counts.get('a')! + 1); // rejected here: TS2895
