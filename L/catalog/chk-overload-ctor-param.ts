// witness: A constructor's overload accepts a key its implementation's parameter doesn't, and the implementation
// looks the key up in a table.
class Tag {
  constructor(key: "a" | "b");
  constructor(readonly key: "a") {}
  text(): string {
    const table = { a: "alpha" };
    return table[this.key].toUpperCase();
  }
}
console.log(new Tag("b").text());
