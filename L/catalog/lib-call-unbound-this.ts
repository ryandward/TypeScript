// witness: CallableFunction.call infers this: unknown for a method, so any thisArg is accepted.
class Basket {
  constructor(readonly items: readonly string[]) {}
  size(): number { return this.items.length; }
}
const basket: Basket = new Basket(['a']);
console.log(basket.size.call({}));
