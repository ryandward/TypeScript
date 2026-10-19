// control: A property the constructor assigns: the checker follows the constructor and sees the assignment.
class Config {
  readonly host: string;
  constructor(host: string) {
    this.host = host;
  }
}
console.log(new Config('example.com').host.toUpperCase());
