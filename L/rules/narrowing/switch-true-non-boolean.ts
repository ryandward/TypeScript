// rejected sound code: Skipping case x proves x isn't true, which leaves 0 here, but a clause that isn't boolean
// narrows nothing in L, so the default branch still holds true.
const size = (x: true | 0): string => {
  switch (true) {
    case x:
      return 'true';
    default:
      return x.toFixed(1); // rejected here: TS2339
  }
};
console.log(size(true), size(0));
