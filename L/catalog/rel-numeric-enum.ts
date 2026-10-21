// witness: isSimpleTypeRelatedTo: `number` is assignable to any numeric enum (bit-flag carve-out).
enum Level { Low, High }
const handlers: { readonly [K in Level]: () => string } = {
  [Level.Low]: () => 'low',
  [Level.High]: () => 'high',
};
const parsed: number = Number('7');
const level: Level = parsed;
console.log(handlers[level]());
