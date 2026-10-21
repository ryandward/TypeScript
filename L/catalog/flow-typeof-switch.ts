// witness: switch (typeof x) uses the same facts (narrowTypeBySwitchOnTypeOf -> getTypeFacts).
type Sized = { readonly length: number };
const size = (x: Sized | number): string => {
  switch (typeof x) {
    case 'object':
      return String(x.length);
    default:
      return x.toFixed(1);
  }
};
console.log(size(3), size('abc'));
