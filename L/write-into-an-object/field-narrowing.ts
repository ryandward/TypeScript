// control: Assigning to an ordinary field narrows it, and the field really holds what was assigned.
const o: { value: string | number } = { value: 1 };
o.value = 'warm';
console.log(o.value.toUpperCase());
