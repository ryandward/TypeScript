// witness: A field initializer calls a method that reads a field declared below it.
class Report {
  readonly title: string = this.makeTitle();
  readonly name: string = "q3";
  makeTitle(): string {
    return this.name.toUpperCase();
  }
}
console.log(new Report().title);
