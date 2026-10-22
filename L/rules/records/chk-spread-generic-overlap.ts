// witness: A spread of a generic type is typed as the intersection of its parts, so a merge of two records that both
// hold x claims x is a number and a string at once, and the value is the later part's string.
const merge = <T extends object, U extends object>(t: T, u: U) => ({ ...t, ...u }); // rejected here: TS2926
const merged = merge({ x: 1 }, { x: 'not a number' });
const n: number = merged.x;
console.log(n.toFixed(2));
