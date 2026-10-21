// witness: getVariances hard-codes Array<T> as covariant (arrayVariances), so string[] is accepted as
// (string | number)[] and the alias can push a number into it.
const strings: string[] = ['a'];
const mixed: (string | number)[] = strings;
mixed.push(1); // rejected here: TS2339
console.log(strings.map((s) => s.toUpperCase()).join(','));
