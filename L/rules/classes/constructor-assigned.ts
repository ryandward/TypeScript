// rejected sound code: A property the constructor assigns can't be read unset, but the core has no classes.
class Config { // rejected here: TS2902
  readonly host: string;
  constructor(host: string) {
    this.host = host; // rejected here: TS2903
  }
}
console.log(new Config('example.com').host.toUpperCase());
