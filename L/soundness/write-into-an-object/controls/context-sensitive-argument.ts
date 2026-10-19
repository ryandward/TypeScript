// A call whose object literal argument holds a context-sensitive function. While that function is skipped, overload
// resolution checks a stand-in for the argument: a placeholder for the function, and the literal stripped of freshness.
// The value relation judges the real argument afterwards.
interface Options { target?: number; module?: number }
type Keys = keyof Options;
function create<T extends Keys[]>(options: { dependencies: T; computeValue: (o: Options) => number }) {
  return options;
}
console.log(create({ dependencies: ['target'], computeValue: (o) => o.module ?? 0 }).computeValue({ module: 2 }));
