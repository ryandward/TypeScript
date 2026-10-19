// The same swap through a generic call whose type argument is wider than the array's element type.
function same<T>(xs: T[]): T[] { return xs; }
const strings: string[] = ['a'];
const wide: (string | number)[] = same<string | number>(strings); // rejected here
wide.push(1);
console.log(strings[1].toUpperCase());
