// rejected sound code: key holds a, an entry of counts, but its type is string, which may be an inherited name, so
// L doesn't read the record by it. A Map read by key is the spelling L takes.
const counts: Readonly<Record<string, number>> = { a: 1 };
const key: string = 'a';
console.log(counts[key]); // rejected here: TS2918
