// control: A generator widened. What it yields only comes out of it, and its reduce from an initial value of the
// wider type takes the wider type through its own U, not T.
function* letters(): Generator<string, void, unknown> {
  yield 'a';
}
const wide: Generator<string | number, void, unknown> = letters();
console.log(wide.toArray().length);
