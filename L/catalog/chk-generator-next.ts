// witness: The generator declares that each yield receives a string, but next() may be called with no argument, and
// then the yield receives undefined.
function* asker(): Generator<number, string, string> {
  const answer = yield 1;
  return answer.toUpperCase();
}
const it = asker();
it.next();
console.log(it.next());
