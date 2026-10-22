// control: A yield's value may be undefined, since next() may pass nothing, and the generator handles it.
function* asker(): Generator<number, string, string> {
  const answer = yield 1;
  return answer === undefined ? 'nothing' : answer.toUpperCase();
}
const it = asker();
it.next();
console.log(it.next('x'));
