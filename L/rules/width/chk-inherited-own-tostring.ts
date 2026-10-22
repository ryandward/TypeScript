// witness: Named doesn't declare toString, so the read finds Object's, but the value holds its own toString: 5.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5 };
const named: Named = raw;
console.log(named.toString()); // rejected here: TS2921
