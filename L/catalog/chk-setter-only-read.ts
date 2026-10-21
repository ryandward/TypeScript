// witness: A property with only a setter is typed as readable, and reading it gives undefined.
class Sink {
  set level(v: string) {
    console.log("set", v);
  }
}
const sink = new Sink();
console.log(sink.level.toUpperCase());
