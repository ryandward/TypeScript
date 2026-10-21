// witness: The same swap through an argument: the parameter's wider name pushes a number into the array.
function pushOne(xs: (string | number)[]): void { xs.push(1); } // rejected here: TS2339
const strings: string[] = ['a'];
pushOne(strings);
console.log(strings.map((s) => s.toUpperCase()).join(','));
