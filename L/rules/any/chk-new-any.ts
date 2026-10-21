// witness: new on any: the checker resolves new value() to a signature that takes anything, and 42 is not a constructor.
const value: any = 42;
const made = new value(); // rejected here: TS2900
