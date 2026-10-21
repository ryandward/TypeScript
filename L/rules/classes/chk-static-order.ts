// witness: A static initializer calls a static method that reads a static field declared below it.
class Registry { // rejected here: TS2902
  static readonly first: string = Registry.compute();
  static readonly base: string = "r";
  static compute(): string {
    return Registry.base.toUpperCase();
  }
}
console.log(Registry.first);
