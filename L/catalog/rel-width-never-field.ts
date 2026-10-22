// witness: propertiesRelatedTo skips an optional property of the target that the source's type doesn't declare, and
// a type names only some of a value's fields, so a record hiding kind: 'tagged' passes as one whose kind can only
// be absent.
type Plain = { readonly v: number; readonly kind?: never };
type Tagged = { readonly kind: 'tagged'; readonly s: string };
type Num = { readonly v: number };
const read = (r: Plain | Tagged): string => (r.kind === undefined ? r.v.toFixed() : r.s.trim());
const wide = { v: 1, kind: 'tagged' as const };
const n: Num = wide;
console.log(read(n)); // TypeError: Cannot read properties of undefined (reading 'trim')
