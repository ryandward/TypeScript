// control: A function whose parameter is wider than the one its type asks for: whatever the caller passes, it takes.
const measure: (x: string) => number = (x: string | number): number => String(x).length;
console.log(measure('abc'));
