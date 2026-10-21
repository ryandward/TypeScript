// witness: Adjacent (strictPropertyInitialization only checks direct this.x in initializers): a field
// initializer that calls a method reads a later field before it is defined.
class Report { // rejected here: TS2902
  readonly size: number = this.measure(); // rejected here: TS2903
  readonly title: string = 'quarterly';
  measure(): number { return this.title.length; } // rejected here: TS2903
}
console.log(new Report().size);
