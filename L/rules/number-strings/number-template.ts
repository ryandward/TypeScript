// control: A number in a template is a `${number}`, and a string a number converts to still narrows as one.
const label: `${number}` = `${2 + 2}`;
const read = (s: `${number}` | 'none'): string => (s === 'none' ? 'nothing' : s);
console.log(label, read(label), read('none'));
