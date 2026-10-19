// rejected sound code: A method the constructor calls does assign the property, but the checker doesn't follow calls, and the
// assertion goes unchecked. The sound spelling assigns it in the constructor or where it's declared.
class Counter {
  count!: number; // rejected here: TS2897
  constructor() {
    this.reset();
  }
  reset(): void {
    this.count = 0;
  }
}
console.log(new Counter().count + 1);
