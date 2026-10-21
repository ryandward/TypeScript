// witness: Adjacent (strictPropertyInitialization only checks direct this.x in initializers): a field
// initializer that calls a method reads a later field before it is defined.
class Report {
  readonly size: number = this.measure();
  readonly title: string = 'quarterly';
  measure(): number { return this.title.length; }
}
console.log(new Report().size);
