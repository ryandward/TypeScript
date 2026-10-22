// witness: A value of type object may hold any property, but getSpreadType returns the left part unchanged when the
// right part is typed object.
const hidden = { x: 'not a number' };
const o: object = hidden;
const merged = { x: 1, ...o }; // rejected here: TS2926
console.log(merged.x.toFixed(2));
