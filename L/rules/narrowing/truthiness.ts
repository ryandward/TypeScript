// control: A record is truthy and undefined isn't, so truthiness tells an optional record from its absence.
type Sized = { readonly length: number };
const size = (x: Sized | undefined): number => (x ? x.length : 0);
console.log(size({ length: 1 }), size(undefined));
