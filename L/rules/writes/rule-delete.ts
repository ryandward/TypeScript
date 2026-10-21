// witness: A required property widened into a writable optional one: the wider name deletes it, and the original
// still says it's there.
type Full = { a: () => number };
type Loose = { a?: () => number };
const full: Full = { a: () => 1 };
const loose: Loose = full;
delete loose.a; // rejected here: TS2904
console.log(full.a());
