// witness: super.name reads the base class's prototype, but the interface typing the base constructor declares name
// as a field of the instance.
interface Named {
  readonly name: string;
}
const NamedBase: new () => Named = class {
  readonly name: string = "n";
};
class Loud extends NamedBase {
  shout(): string {
    return super.name.toUpperCase();
  }
}
console.log(new Loud().shout());
