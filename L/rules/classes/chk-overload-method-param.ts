// witness: A method's overload accepts a key its implementation's parameter doesn't, and the implementation looks
// the key up in a table.
class Lookup { // rejected here: TS2902
  get(key: "a" | "b"): string; // rejected here: TS2394
  get(key: "a"): string {
    const table = { a: "alpha" };
    return table[key].toUpperCase();
  }
}
console.log(new Lookup().get("b"));
