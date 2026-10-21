// witness: x.constructor === C narrows to C (isConstructedBy compares class symbols), but any object
// can carry a constructor property.
class Cat { meow(): string { return 'meow'; } }
type Rock = { readonly constructor: Function };
const poke = (x: Cat | Rock): string => (x.constructor === Cat ? x.meow() : 'rock');
const rock: Rock = { constructor: Cat };
console.log(poke(rock));
