// rejected sound code: An abstract method's predicate is a requirement each subclass's method has to prove, which is
// sound, but the core has no classes.
abstract class Shape { // rejected here: TS2902
  abstract isText(x: unknown): x is string;
}
class Words extends Shape { // rejected here: TS2902
  isText(x: unknown) {
    return typeof x === 'string';
  }
}
const input: unknown = 42;
console.log(new Words().isText(input) ? input.toUpperCase() : 'no');
