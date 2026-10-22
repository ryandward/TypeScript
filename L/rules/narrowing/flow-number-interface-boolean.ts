// witness: The same as flow-number-interface-ternary, with boolean beside Number.
const pick = (): boolean | Number => 0; // rejected here: TS2913
const v = pick();
const r = v ? 'yes' : v;
// Runtime: TypeError: r.toUpperCase is not a function
if (r !== false) console.log(r.toUpperCase());
