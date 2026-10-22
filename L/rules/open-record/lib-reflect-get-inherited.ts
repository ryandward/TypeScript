// witness: Reflect.get reads a key the way an element access does, but types the read as T[P] where no read is
// checked, so toString read from a Record<string, number> is typed number.
const counts: Readonly<Record<string, number>> = { a: 1 };
const key: string = 'toString';
const hit = Reflect.get(counts, key); // rejected here: TS2550
console.log(hit.toFixed());
