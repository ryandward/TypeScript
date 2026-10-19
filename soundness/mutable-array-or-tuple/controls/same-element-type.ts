// The same element type: nothing is widened.
const a: string[] = ['a'];
const b: string[] = a;
b.push('b');
console.log(a.join(','));
