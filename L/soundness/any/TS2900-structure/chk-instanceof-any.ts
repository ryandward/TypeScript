// instanceof any: the checker accepts value as the right side without asking whether it is callable, and 42
// isn't.
const value: any = 42;
const is = [] instanceof value; // rejected here: TS2900
