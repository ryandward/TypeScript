// control: A property initialized where it's declared.
class Config {
  readonly host: string = 'example.com';
}
console.log(new Config().host.toUpperCase());
