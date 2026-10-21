// witness: A class method is read off its object and called alone, so this is undefined.
class Counter {
  constructor(readonly label: string) {}
  describe(): string {
    return this.label.toUpperCase();
  }
}
const counter = new Counter("a");
const describe = counter.describe;
console.log(describe());
