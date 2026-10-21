// control: A generator widened: what it yields only comes out of it, and toArray() hands out a new array, declared
// readonly.
function* letters(): Generator<string, void, unknown> {
  yield 'a';
}
const wide: Generator<string | number, void, unknown> = letters();
console.log(wide.toArray().length);
