// control: Two instantiations of the same anonymous type with the same type argument relate, generic method and all.
function make<U>(seed: U) {
  return { feed: <T>(f: (t: T | U) => string): string => f(seed) };
}
const first = make(1);
const second: typeof first = make(2);
console.log(second.feed<number>((t: number) => t.toFixed(1)));
