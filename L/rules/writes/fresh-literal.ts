// rejected sound code: A fresh array literal given a wider type, then written: nothing else holds it, so nothing
// narrower breaks. It can't go wrong, but the core changes no object in place.
const xs: (string | number)[] = ['a'];
xs.push(1); // rejected here: TS2339
console.log(xs.join(','));
