// witness: reduce without an initial value throws TypeError on an empty array (documented partiality).
const xs: readonly number[] = [];
console.log(xs.reduce((a, b) => a + b)); // rejected here: TS2554
