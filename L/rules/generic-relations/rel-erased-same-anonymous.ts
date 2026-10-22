// witness: signaturesRelatedTo first branch: two instantiations of the same anonymous type are compared pairwise
// with erase=true, so the method's own T is replaced with any and T | U collapses to any.
function make<U>(seed: U) {
  return { feed: <T>(f: (t: T | U) => string): string => f(seed) };
}
const numeric = make(42);
const stringy = make('hello');
const swapped: typeof numeric = stringy; // rejected here: TS2322
console.log(swapped.feed<number>((t: number) => t.toFixed(1)));
