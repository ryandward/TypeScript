// witness: Object.groupBy returns Partial<Record<K, T[]>>, an ordinary object type with Object.prototype's
// members, but the runtime object has a null prototype.
const groups: Partial<Record<'even' | 'odd', readonly number[]>> = Object.groupBy([1, 2, 3], (n: number) => (n % 2 === 0 ? 'even' : 'odd')); // rejected here: TS2550
console.log(groups.hasOwnProperty('even')); // rejected here: TS2921
