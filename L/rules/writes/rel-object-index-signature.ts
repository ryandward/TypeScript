// witness: indexInfoRelatedTo relates a writable index signature in one direction only, so the wider name
// stores a number under a new key.
const dict: { [k: string]: string } = { a: 'a' };
const wide: { [k: string]: string | number } = dict;
wide.b = 1; // rejected here: TS2904
console.log(Object.values(dict).map((s) => s.toUpperCase()).join(','));
