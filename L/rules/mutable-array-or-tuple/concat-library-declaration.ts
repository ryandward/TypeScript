// control: concat never writes into its argument, and ConcatArray<T>.slice() hands out a new array, declared
// readonly, so string[] passes as ConcatArray<string | number>.
const strings: string[] = ['a'];
const sink: (string | number)[] = [];
console.log(sink.concat(strings).join(','));
