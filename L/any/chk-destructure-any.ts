// witness: Destructuring any: the checker gives name the type any without asking whether value can be null, and null
// can't be destructured.
const value: any = null;
const { name } = value; // rejected here: TS2900
