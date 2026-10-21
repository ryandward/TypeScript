// witness: PromiseRejectedResult's reason is any, so a callback may claim a record type for it inside its
// parameter, and record depth inside parameter contravariance carries the any to the field.
type Failure = { readonly status: 'rejected'; readonly reason: { readonly n: number } };
const settled = await Promise.allSettled([Promise.reject('just a string')]);
const failures = settled.filter((r) => r.status === 'rejected');
failures.forEach((r: Failure) => console.log(r.reason.n.toFixed(1))); // rejected here: TS2898
export {};
