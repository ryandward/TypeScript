// witness: The same null-prototype object, observed through string conversion in a template literal.
const groups: Partial<Record<'even' | 'odd', readonly number[]>> = Object.groupBy([1, 2, 3], (n: number) => (n % 2 === 0 ? 'even' : 'odd')); // rejected here: TS2550
console.log(`groups: ${groups}`);
