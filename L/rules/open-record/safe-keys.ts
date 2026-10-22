// control: A key whose type can't name an inherited member reads an entry: a literal, a number, and a template
// literal type whose every value starts with data-.
const counts: Readonly<Record<string, number>> = { a: 1, 2: 3 };
const attrs: { readonly [key: `data-${string}`]: string } = { 'data-id': 'x' };
const attr: `data-${string}` = 'data-id';
console.log(counts['a'], counts.a, counts[2], attrs[attr]);
