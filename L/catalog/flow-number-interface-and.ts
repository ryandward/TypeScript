// witness: The Number interface is always truthy to the checker, so v && x is typed as x, though v may be 0.
type Shout = { readonly shout: () => string };
const loud: Shout = { shout: () => 'HEY' };
const pick = (): Number => 0;
const v = pick();
const r = v && loud;
// Runtime: TypeError: r.shout is not a function
console.log(r.shout());
