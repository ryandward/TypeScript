// A fresh array literal given a wider type: no narrower name exists to break.
const xs: (string | number)[] = ['a'];
xs.push(1);
console.log(xs.join(','));
