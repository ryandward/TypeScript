// witness: A `declare` field promises a property that nothing assigns.
class Config { // rejected here: TS2902
  declare readonly path: string;
}
console.log(new Config().path.toUpperCase());
