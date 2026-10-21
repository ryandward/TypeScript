// rejected sound code: A method the constructor calls assigns the property, so the program can't go wrong, but the
// core has no classes. A function returns the record with every field set.
class Counter { // rejected here: TS2902
  count!: number;
  constructor() {
    this.reset(); // rejected here: TS2903
  }
  reset(): void {
    this.count = 0; // rejected here: TS2903
  }
}
console.log(new Counter().count + 1);
