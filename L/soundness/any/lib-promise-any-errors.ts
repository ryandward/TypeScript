// AggregateError.errors is any[], so it fits Error[] even when the reasons were strings.
const settled: Promise<number> = Promise.any([Promise.reject('nope')]).catch((e: AggregateError) => { // rejected here: TS2898
  const errs: readonly Error[] = e.errors; // rejected here: TS2898
  return errs.map((x) => x.message.length).length;
});
console.log(await settled);
export {};
