// An element read off any: the checker gives value[0] the type any, and null has no elements.
const value: any = null;
const first = value[0]; // rejected here: TS2900
