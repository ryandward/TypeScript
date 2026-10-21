// witness: A field initializer calls an arrow-function field that reads a field declared below both.
class Panel {
  readonly label = (): string => this.name.toUpperCase();
  readonly shown: string = this.label();
  readonly name: string = "panel";
}
console.log(new Panel().shown);
