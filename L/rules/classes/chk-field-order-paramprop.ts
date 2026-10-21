// witness: A field initializer calls a method that reads a parameter property, which is assigned only after the
// field initializers run.
class Client { // rejected here: TS2902
  readonly url: string = this.buildUrl(); // rejected here: TS2903
  constructor(readonly host: string) {}
  buildUrl(): string {
    return "https://".concat(this.host.toLowerCase()); // rejected here: TS2903
  }
}
console.log(new Client("example.com").url);
