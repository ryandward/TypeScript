// witness: A `declare` field promises a property that nothing assigns.
class Config {
  declare readonly path: string;
}
console.log(new Config().path.toUpperCase());
