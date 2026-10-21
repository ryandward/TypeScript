// witness: A field initializer calls an arrow-function field that reads a field declared below both.
class Panel { // rejected here: TS2902
  readonly label = (): string => this.name.toUpperCase(); // rejected here: TS2903
  readonly shown: string = this.label(); // rejected here: TS2903
  readonly name: string = "panel";
}
console.log(new Panel().shown);
