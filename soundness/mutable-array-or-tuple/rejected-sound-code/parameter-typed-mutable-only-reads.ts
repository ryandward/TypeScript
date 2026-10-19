// The parameter only reads, but its type grants writes, and nothing establishes that the callee won't
// write. The sound spelling is `readonly unknown[]`.
function count(xs: unknown[]): number { return xs.length; }
const strings: string[] = ['a'];
console.log(count(strings)); // rejected here
