// rejected sound code: A fresh tuple literal given a wider element type, then written: nothing else holds it. It
// can't go wrong, but the core changes no object in place.
const pair: [string | number] = ['a'];
pair[0] = 1; // rejected here: TS2904
console.log(pair[0]);
