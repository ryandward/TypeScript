// witness: A required property widened into a writable index signature: the wider name deletes it by key.
type Full = { a: string };
const full: Full = { a: 'x' };
const dict: { [k: string]: string } = full;
delete dict['a']; // rejected here: TS2904
console.log(full.a.toUpperCase());
