// concat never writes into its argument, but lib.es5.d.ts declares ConcatArray<T>.slice(): T[], a mutable
// array in return position, so string[] as ConcatArray<string | number> needs the covariant relation.
const strings: string[] = ['a'];
const sink: (string | number)[] = [];
console.log(sink.concat(strings).join(',')); // rejected here
