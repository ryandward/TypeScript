// A call on any: the checker resolves value() to a signature that takes anything, and 42 is not a function.
const value: any = 42;
value(); // rejected here: TS2900
