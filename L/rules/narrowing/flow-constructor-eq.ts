// witness: x.constructor === C narrows to C's instances (isConstructedBy compares the constructor's symbol), but any
// object can carry a constructor property.
type Rock = { readonly constructor: Function };
const poke = (x: Error | Rock): number => (x.constructor === Error ? x.message.length : 0); // rejected here: TS2339
const rock: Rock = { constructor: Error };
console.log(poke(rock));
