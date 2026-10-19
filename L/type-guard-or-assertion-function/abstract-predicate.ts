// control: An abstract method's predicate is a requirement on each subclass, whose method has to prove it.
abstract class Shape {
  abstract isText(x: unknown): x is string;
}
class Words extends Shape {
  isText(x: unknown) {
    return typeof x === 'string';
  }
}
const input: unknown = 42;
console.log(new Words().isText(input) ? input.toUpperCase() : 'no');
