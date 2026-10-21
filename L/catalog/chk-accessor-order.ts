// witness: A field initializer calls a method that reads an auto-accessor declared below it, before the accessor
// has storage.
class Panel {
  readonly width: number = this.compute();
  accessor title: string = "t";
  compute(): number {
    return this.title.length;
  }
}
console.log(new Panel().width);
