// rejected sound code: A fresh object literal given a wider type, then written: nothing else holds it. It can't go
// wrong, but the core changes no object in place.
const wide: { value: string | number } = { value: 'a' };
wide.value = 1; // rejected here: TS2904
console.log(wide.value);
