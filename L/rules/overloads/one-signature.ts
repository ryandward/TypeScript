// control: A function with one signature over a union of its inputs, whose body is checked against it.
const describe = (input: string | number): string => (typeof input === 'string' ? input : input.toFixed(1));
console.log(describe('a'), describe(1));
