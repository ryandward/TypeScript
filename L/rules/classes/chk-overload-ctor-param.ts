// witness: A constructor's overload accepts a key its implementation's parameter doesn't, and the implementation
// looks the key up in a table.
class Tag { // rejected here: TS2902
  constructor(key: "a" | "b"); // rejected here: TS2394
  constructor(readonly key: "a") {}
  text(): string {
    const table = { a: "alpha" };
    return table[this.key].toUpperCase(); // rejected here: TS2903
  }
}
console.log(new Tag("b").text());
