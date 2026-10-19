// The constraint accepts every function, and the function is only handed back, never called through the any, so
// nothing unchecked happens. (...args: never[]) => unknown accepts the same functions without the keyword.
const keep = <F extends (...args: any[]) => any>(f: F): F => f; // rejected here: TS2898
console.log(keep((n: number) => n + 1)(1));
