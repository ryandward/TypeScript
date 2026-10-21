// control: A readonly tuple widened.
const pair: readonly [string] = ['a'];
const wide: readonly [string | number] = pair;
console.log(wide[0]);
