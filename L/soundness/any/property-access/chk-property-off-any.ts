// A property read off any, with no call: the checker gives value.length the type any without asking whether
// value can be null, and null has no properties to read.
const value: any = null;
const length = value.length;
