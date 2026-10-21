// witness: A class's prototype is typed as an instance, but instance fields live on each instance, not on the
// prototype.
class Item {
  readonly name: string = "x";
}
console.log(Item.prototype.name.toUpperCase());
