// witness: A class method is read off its object and called alone, so this is undefined.
class Counter { // rejected here: TS2902
  constructor(readonly label: string) {}
  describe(): string {
    return this.label.toUpperCase(); // rejected here: TS2903
  }
}
const counter = new Counter("a");
const describe = counter.describe;
console.log(describe());
