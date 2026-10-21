// witness: A field initializer calls a method that reads a parameter property, which is assigned only after the
// field initializers run.
class Client {
  readonly url: string = this.buildUrl();
  constructor(readonly host: string) {}
  buildUrl(): string {
    return "https://".concat(this.host.toLowerCase());
  }
}
console.log(new Client("example.com").url);
