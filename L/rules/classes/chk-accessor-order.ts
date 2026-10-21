// witness: A field initializer calls a method that reads an auto-accessor declared below it, before the accessor
// has storage.
class Panel { // rejected here: TS2902
  readonly width: number = this.compute(); // rejected here: TS2903
  accessor title: string = "t";
  compute(): number {
    return this.title.length; // rejected here: TS2903
  }
}
console.log(new Panel().width);
