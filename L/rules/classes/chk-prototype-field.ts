// witness: A class's prototype is typed as an instance, but instance fields live on each instance, not on the
// prototype.
class Item { // rejected here: TS2902
  readonly name: string = "x";
}
console.log(Item.prototype.name.toUpperCase()); // rejected here: TS2339
