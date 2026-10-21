// witness: An arrow function that reads this is called before super(), and the check for this before super doesn't
// look inside the arrow.
class Base {
  constructor(readonly tag: string) {}
}
class Child extends Base {
  constructor() {
    const read = (): string => this.tag;
    super(read());
  }
}
console.log(new Child().tag);
