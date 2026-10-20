// control: An abstract class can't be constructed, but its construct signature still promises a prototype.
abstract class Shape {}
class Square extends Shape {}
const value: object = new Square();
console.log(value instanceof Shape);
