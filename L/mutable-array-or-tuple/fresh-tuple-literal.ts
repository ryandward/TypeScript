// control: A fresh tuple literal given a wider element type: no narrower name exists to break.
const pair: [string | number] = ['a'];
pair[0] = 1;
console.log(pair[0]);
