// witness: The same, through &&: the falsy part of false | Number is false alone, and the 0 comes out typed false |
// Shout.
type Shout = { readonly shout: () => string };
const loud: Shout = { shout: () => 'HEY' };
const pick = (): false | Number => 0;
const v = pick();
const r = v && loud;
// Runtime: TypeError: r.shout is not a function
if (r !== false) console.log(r.shout());
