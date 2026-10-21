// witness: x.constructor === C narrows to C's instances (isConstructedBy compares the constructor's symbol), but any
// object can carry a constructor property.
type Rock = { readonly constructor: Function };
const poke = (x: Map<string, number> | Rock): string => (x.constructor === Map ? String(x.get('a')) : 'rock');
const rock: Rock = { constructor: Map };
console.log(poke(rock));
