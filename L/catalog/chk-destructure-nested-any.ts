// witness: Iterator<number> defaults TReturn to any, so a result's value is any, and a destructuring pattern reads
// a field off it with no expression of type any for the checker to judge.
const it: Iterator<number> = [1].values();
console.log(it.next());
// Runtime: TypeError: Cannot read properties of undefined (reading 'length') (the second next() is done, value undefined)
const { value: { length } } = it.next();
export { length };
