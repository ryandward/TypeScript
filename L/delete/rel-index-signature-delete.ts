// witness: A required property widened into a writable index signature: the wider name deletes it by key.
type Full = { a: string };
const full: Full = { a: 'x' };
const dict: { [k: string]: string } = full; // rejected here: TS2894
delete dict['a'];
console.log(full.a.toUpperCase());
