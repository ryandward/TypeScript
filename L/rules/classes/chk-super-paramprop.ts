// witness: super.name reads the base class's prototype, but name is a parameter property, which lives on the
// instance.
class Base { // rejected here: TS2902
  constructor(readonly name: string) {}
}
class Child extends Base { // rejected here: TS2902
  shout(): string {
    return super.name.toUpperCase(); // rejected here: TS2903
  }
}
console.log(new Child("a").shout());
