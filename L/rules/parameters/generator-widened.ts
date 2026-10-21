// rejected sound code: A generator widened. What it yields only comes out of it, but as an iterator it has
// reduce(callbackfn, initialValue: T), and a method that takes T makes T invariant.
function* letters(): Generator<string, void, unknown> {
  yield 'a';
}
const wide: Generator<string | number, void, unknown> = letters(); // rejected here: TS2322
console.log(wide.toArray().length);
