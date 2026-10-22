// witness: propertiesRelatedTo skips an optional property of the target that the source's type doesn't declare, and
// a type names only some of a value's fields, so an iterator result carrying report: 5 passes as one whose report
// is an optional function.
const raw = { done: false as const, value: 1, report: 5 };
const result: IteratorYieldResult<number> = raw;
const seen: { readonly value: number; readonly report?: () => string } = result;
console.log(seen.report?.()); // TypeError: seen.report is not a function
