// control: A parameter typed as a mutable array of unknown, handed strings. With no write possible, the wider type
// only reads.
function count(xs: unknown[]): number { return xs.length; }
const strings: string[] = ['a'];
console.log(count(strings));
