// A property asserted to be assigned that nothing assigns: the checker takes the assertion's word.
class Config {
  readonly host!: string; // rejected here: TS2897
}
console.log(new Config().host.toUpperCase());
