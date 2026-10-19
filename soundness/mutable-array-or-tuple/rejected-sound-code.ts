// Programs that are safe but that the mutable-array-or-tuple decision rejects on purpose. Each runs
// without throwing.

// The parameter only reads, but its type grants writes, and nothing establishes that the callee won't
// write. The sound spelling is `readonly unknown[]`.
function count(xs: unknown[]): number { return xs.length; }
const strings: string[] = ['a'];
console.log(count(strings)); // rejected here

// concat never writes into its argument, but lib.es5.d.ts declares ConcatArray<T>.slice(): T[], a
// mutable array in return position, so string[] as ConcatArray<string | number> needs the covariant
// relation. The library's declaration depends on the hole.
const sink: (string | number)[] = [];
console.log(sink.concat(strings).join(',')); // rejected here
