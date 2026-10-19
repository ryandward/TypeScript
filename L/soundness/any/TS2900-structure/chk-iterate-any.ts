// for-of over any: the checker gives each item the type any without finding an iterator, and 42 has none.
const value: any = 42;
for (const item of value) console.log(item); // rejected here: TS2900
