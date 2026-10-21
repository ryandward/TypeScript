// witness: computeExhaustiveSwitchStatement uses the same TypeFacts: a typeof switch covering 'object'
// and 'number' is taken as exhaustive for Sized | number, so the implicit fall-off return of
// undefined is never reported.
type Sized = { readonly length: number };
const kindOf = (x: Sized | number): string => {
  switch (typeof x) {
    case 'object':
      return 'object';
    case 'number':
      return 'number';
  }
};
console.log(kindOf('abc').toUpperCase());
