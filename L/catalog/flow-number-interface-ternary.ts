// witness: The Number interface gets object facts, always truthy, though 0 is assignable to it, so the false branch
// of a test on false | Number is false alone.
const pick = (): false | Number => 0;
const v = pick();
const r = v ? 'yes' : v;
// Runtime: TypeError: r.toUpperCase is not a function
if (r !== false) console.log(r.toUpperCase());
