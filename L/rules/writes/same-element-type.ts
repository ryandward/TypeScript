// rejected sound code: An array written through a name of the same element type: nothing is widened. It can't go
// wrong, but the core changes no object in place.
const a: string[] = ['a'];
const b: string[] = a;
b.push('b'); // rejected here: TS2339
console.log(a.join(','));
