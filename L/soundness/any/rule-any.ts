// The value is a number, but any lets it be used as anything, so it's called as a string.
const value: any = 42; // rejected here: TS2898
console.log(value.toUpperCase());
