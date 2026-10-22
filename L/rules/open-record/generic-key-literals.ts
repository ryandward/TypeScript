// control: A generic key bounded by a union of literals names keys the record has, so the read is the record's type.
const read = <K extends 'a' | 'b'>(t: Readonly<Record<K, string>>, k: K): string => t[k].toUpperCase();
console.log(read<'a' | 'b'>({ a: 'x', b: 'y' }, 'a'));
