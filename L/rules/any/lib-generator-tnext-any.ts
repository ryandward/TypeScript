// witness: Generator<T, TReturn = any, TNext = any>: the yield expression is any when TNext is defaulted.
function* asker(): Generator<number> {
  const reply: string = yield 1; // rejected here: TS2898
  console.log(reply.length);
}
const it: Generator<number> = asker();
it.next();
it.next();
