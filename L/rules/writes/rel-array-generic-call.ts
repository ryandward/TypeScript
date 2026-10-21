// witness: The same swap through a generic call whose type argument is wider than the array's element type.
function same<T>(xs: T[]): T[] { return xs; }
const strings: string[] = ['a'];
const wide: (string | number)[] = same<string | number>(strings);
wide.push(1); // rejected here: TS2339
console.log(strings.map((s) => s.toUpperCase()).join(','));
