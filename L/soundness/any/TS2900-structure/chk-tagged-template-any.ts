// A tagged template on any: the checker calls value as the tag without a signature, and 42 is not a function.
const value: any = 42;
const text = value`label`; // rejected here: TS2900
