// witness: super.name reads the base class's prototype, but the interface typing the base constructor declares name
// as a field of the instance.
interface Named {
  readonly name: string;
}
const NamedBase: new () => Named = class { // rejected here: TS2902
  readonly name: string = "n";
};
class Loud extends NamedBase { // rejected here: TS2902
  shout(): string {
    return super.name.toUpperCase(); // rejected here: TS2903
  }
}
console.log(new Loud().shout());
