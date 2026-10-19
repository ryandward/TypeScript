// A readonly array widened: the wider name has no position to store through.
const strings: readonly string[] = ['a'];
const wide: readonly (string | number)[] = strings;
console.log(wide.length, strings[0]);
