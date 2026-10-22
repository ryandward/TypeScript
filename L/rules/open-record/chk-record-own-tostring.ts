// witness: A record of numbers whose literal had a toString entry: the property access finds Object's toString in
// the record's type, and the entry, 5, at run time.
const counts: Readonly<Record<string, number>> = { toString: 5 };
console.log(counts.toString()); // rejected here: TS18046
