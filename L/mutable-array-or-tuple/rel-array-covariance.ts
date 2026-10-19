// witness: getVariances hard-codes Array<T> as covariant (arrayVariances), so string[] is accepted as
// (string | number)[] and the alias can push a number into it.
const strings: string[] = ['a'];
const mixed: (string | number)[] = strings; // rejected here: TS2891
mixed.push(1);
console.log(strings.map((s) => s.toUpperCase()).join(','));
