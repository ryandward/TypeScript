// witness: A spread of a class instance keeps the interface's method in its type, but a spread copies only own
// properties, and the method is on the prototype.
interface Greeter {
  greet(): string;
}
class English {
  greet(): string {
    return "hi";
  }
}
const g: Greeter = new English();
const copy = { ...g };
console.log(copy.greet());
