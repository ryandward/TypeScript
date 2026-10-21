// witness: CallableFunction.call infers this: unknown for a method, so any thisArg is accepted.
class Basket { // rejected here: TS2902
  constructor(readonly items: readonly string[]) {}
  size(): number { return this.items.length; } // rejected here: TS2903
}
const basket: Basket = new Basket(['a']);
console.log(basket.size.call({})); // rejected here: TS2339
