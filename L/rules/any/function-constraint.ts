// rejected sound code: keep never calls f, but F's constraint types its parameters any, which promises f anything,
// and a body bounded by it may pass f anything, or nothing.
const keep = <F extends (...args: any[]) => any>(f: F): F => f;
console.log(keep((n: number) => n + 1)(1)); // rejected here: TS2920
