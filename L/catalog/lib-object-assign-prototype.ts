// witness: Object.assign<T, U>(target, source): T & U, but only own enumerable properties are copied.
class Counter {
  constructor(readonly start: number) {}
  next(): number { return this.start + 1; }
}
const original: Counter = new Counter(1);
const copy: Counter = Object.assign({}, original);
console.log(copy.next());
