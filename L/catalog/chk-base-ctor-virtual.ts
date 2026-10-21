// witness: A base class's field initializer calls a method the subclass overrides, and the override reads a
// subclass field that isn't set yet.
class Base {
  readonly summary: string = this.describe();
  describe(): string {
    return "base";
  }
}
class Named extends Base {
  readonly name: string = "derived";
  override describe(): string {
    return this.name.toUpperCase();
  }
}
console.log(new Named().summary);
