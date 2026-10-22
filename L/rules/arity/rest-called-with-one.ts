// rejected sound code: The program calls f with one argument, which n needs, but f's type allows a call with none.
const f: (...xs: readonly number[]) => number = (n: number) => n; // rejected here: TS2919
console.log(f(1));
