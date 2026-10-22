// control: A Map holds its entries apart from its members, so a key of type string reads an entry or nothing, and
// Object.entries reads only a record's own entries.
const counts = new Map<string, number>([['toString', 1]]);
const key: string = 'toString';
const record: Readonly<Record<string, number>> = { a: 1 };
console.log(counts.get(key), Object.entries(record));
