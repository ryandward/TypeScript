// witness: A field initializer calls a method that reads an abstract property, which the subclass sets only after
// the base class's fields run.
abstract class Shape { // rejected here: TS2902
  abstract readonly name: string;
  readonly label: string = this.describe(); // rejected here: TS2903
  describe(): string {
    return this.name.toUpperCase(); // rejected here: TS2903
  }
}
class Circle extends Shape { // rejected here: TS2902
  readonly name: string = "circle";
}
console.log(new Circle().label);
