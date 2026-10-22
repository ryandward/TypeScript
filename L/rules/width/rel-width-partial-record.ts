// witness: propertiesRelatedTo skips an optional property of the target that the source's type doesn't declare, and
// a type names only some of a value's fields, so a record whose onDone is a string passes as a
// Partial<Record<'onDone', () => string>>, and onDone is called.
type Hooks = Partial<Record<'onDone', () => string>>;
const raw = { onDone: 'not a function' };
const hiddenObj: {} = raw;
const mk = () => hiddenObj;
const getHooks: () => Hooks = mk; // rejected here: TS2915
const run = (): string => {
  const done = getHooks().onDone;
  if (done === undefined) return 'none';
  // Runtime: TypeError: done is not a function
  return done();
};
console.log(run());
