// control: A union of literals and a list of them, made before anything reads it: what an enum named, without the
// enum.
type Color = 'red' | 'green';
const colors: readonly Color[] = ['red', 'green'];
const shout = (c: Color): string => c.toUpperCase();
console.log(colors.map(shout));
