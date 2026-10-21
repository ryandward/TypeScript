// rejected sound code: A property initialized where it's declared can't be read unset, but the core has no classes.
class Config { // rejected here: TS2902
  readonly host: string = 'example.com';
}
console.log(new Config().host.toUpperCase());
