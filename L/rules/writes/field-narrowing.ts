// rejected sound code: Assigning to an ordinary field narrows it, and the field really holds what was assigned. It
// can't go wrong, but the core changes no object in place.
const o: { value: string | number } = { value: 1 };
o.value = 'warm'; // rejected here: TS2904
console.log(o.value.toUpperCase());
