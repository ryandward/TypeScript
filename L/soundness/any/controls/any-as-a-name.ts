// The check is on the type, not the word: any as a variable or a property name is an ordinary name.
const any = ['first'];
const flags = { any: true };
console.log(any.length, flags.any);
