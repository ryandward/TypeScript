// witness: super.name reads the base class's prototype, but name is a parameter property, which lives on the
// instance.
class Base {
  constructor(readonly name: string) {}
}
class Child extends Base {
  shout(): string {
    return super.name.toUpperCase();
  }
}
console.log(new Child("a").shout());
