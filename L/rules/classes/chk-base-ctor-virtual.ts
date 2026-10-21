// witness: A base class's field initializer calls a method the subclass overrides, and the override reads a
// subclass field that isn't set yet.
class Base { // rejected here: TS2902
  readonly summary: string = this.describe(); // rejected here: TS2903
  describe(): string {
    return "base";
  }
}
class Named extends Base { // rejected here: TS2902
  readonly name: string = "derived";
  override describe(): string {
    return this.name.toUpperCase(); // rejected here: TS2903
  }
}
console.log(new Named().summary);
