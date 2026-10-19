// The same swap through an argument: the parameter's wider name pushes a number into the array.
function pushOne(xs: (string | number)[]): void { xs.push(1); }
const strings: string[] = ['a'];
pushOne(strings); // rejected here
console.log(strings[1].toUpperCase());
