// control: A key of type string may name a member every object inherits, so the read is unknown, and the program
// narrows it to the entry it wants. A dynamic key isn't banned; its value just isn't vouched for.
const counts: Readonly<Record<string, number>> = { a: 1 };
const key: string = 'a';
const hit = counts[key];
console.log(typeof hit === 'number' ? hit.toFixed() : 'none');
