// witness: in on any: the checker accepts value as the right side without asking whether it is an object, and 42 isn't.
const value: any = 42;
const has = 'name' in value; // rejected here: TS2900
