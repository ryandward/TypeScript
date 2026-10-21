// witness: Object.assign<T, U>(target, source): T & U, but only own enumerable properties are copied.
class Counter { // rejected here: TS2902
  constructor(readonly start: number) {}
  next(): number { return this.start + 1; } // rejected here: TS2903
}
const original: Counter = new Counter(1);
const copy: Counter = Object.assign({}, original);
console.log(copy.next());
