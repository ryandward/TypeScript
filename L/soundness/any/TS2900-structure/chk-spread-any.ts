// An array spread of any: the checker spreads value without finding an iterator, and 42 has none.
const value: any = 42;
const items = [...value]; // rejected here: TS2900
