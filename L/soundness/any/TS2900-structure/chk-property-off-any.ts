// A property read off any: the checker gives value.length the type any without looking for length, and null
// has no properties.
const value: any = null;
const length = value.length;
