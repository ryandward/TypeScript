// witness: replace's replacer is (substring: string, ...args: any[]) => string, so groups can be typed string.
const out: string = 'b'.replace(/(a)|b/, (whole: string, first: string) => whole + first.toUpperCase()); // rejected here: TS2920
console.log(out);
