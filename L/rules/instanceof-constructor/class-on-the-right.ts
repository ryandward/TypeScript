// control: A class has a construct signature, and its prototype is always an object.
class Box {}
const value: object = new Box();
console.log(value instanceof Box);
