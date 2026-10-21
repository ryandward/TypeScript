// witness: A property asserted to be assigned that nothing assigns: the checker takes the assertion's word.
class Config { // rejected here: TS2902
  readonly host!: string;
}
console.log(new Config().host.toUpperCase());
