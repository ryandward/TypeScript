// witness: The same rest taken in a parameter's pattern.
const strip = <T extends object>({ ...rest }: T) => rest; // rejected here: TS2926
const n: number = strip([1, 2]).length;
console.log(n.toFixed(0));
