// rejected sound code: A class has a construct signature and a prototype, so instanceof with one on the right can't
// throw, but the core has no classes.
class Box {} // rejected here: TS2902
const value: object = new Box();
console.log(value instanceof Box);
