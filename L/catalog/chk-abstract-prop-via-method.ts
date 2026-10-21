// witness: A field initializer calls a method that reads an abstract property, which the subclass sets only after
// the base class's fields run.
abstract class Shape {
  abstract readonly name: string;
  readonly label: string = this.describe();
  describe(): string {
    return this.name.toUpperCase();
  }
}
class Circle extends Shape {
  readonly name: string = "circle";
}
console.log(new Circle().label);
