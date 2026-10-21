// rejected sound code: An abstract class's construct signature still promises a prototype, so instanceof with one on
// the right can't throw, but the core has no classes.
abstract class Shape {} // rejected here: TS2902
class Square extends Shape {} // rejected here: TS2902
const value: object = new Square();
console.log(value instanceof Shape);
