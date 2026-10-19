// indexInfoRelatedTo relates a writable index signature in one direction only, so the wider name
// stores a number under a new key.
const dict: { [k: string]: string } = { a: 'a' };
const wide: { [k: string]: string | number } = dict; // rejected here: TS2890
wide.b = 1;
console.log(Object.values(dict).map((s) => s.toUpperCase()).join(','));
