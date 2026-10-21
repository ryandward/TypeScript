// witness: A field initializer calls a method that reads a field declared below it.
class Report { // rejected here: TS2902
  readonly title: string = this.makeTitle(); // rejected here: TS2903
  readonly name: string = "q3";
  makeTitle(): string {
    return this.name.toUpperCase(); // rejected here: TS2903
  }
}
console.log(new Report().title);
