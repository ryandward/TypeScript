// rejected sound code: The type literal's read of key is erased, but the call above key's line reads f, which reads
// key when it runs, so L still holds f to the order of the file.
const f = (): string => key; // rejected here: TS2912
type Keyed = { readonly [key]: number };
const k: Keyed = { k: 1 };
const key = 'k';
console.log(f(), k.k);
