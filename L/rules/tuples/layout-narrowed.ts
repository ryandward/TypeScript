// control: A spread of a tuple with an optional element is one of its layouts, and a place before the optional
// element is the same in every layout, so it reads as typed.
const head: readonly [string, number?] = ['x', 1];
const row = [...head, { n: 1 }] as const;
console.log(row[0].toUpperCase(), row.length);
