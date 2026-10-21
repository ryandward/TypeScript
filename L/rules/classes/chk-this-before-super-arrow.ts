// witness: An arrow function that reads this is called before super(), and the check for this before super doesn't
// look inside the arrow.
class Base { // rejected here: TS2902
  constructor(readonly tag: string) {}
}
class Child extends Base { // rejected here: TS2902
  constructor() {
    const read = (): string => this.tag; // rejected here: TS2903
    super(read()); // rejected here: TS2903
  }
}
console.log(new Child().tag);
