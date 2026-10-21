// witness: Narrowing of a property path survives a call that replaces the property.
// getTypeAtFlowCall returns no type for a call without an asserts predicate, so the
// condition node before the call still decides the type of h.shape after it.
type Circle = { readonly kind: 'circle'; readonly radius: () => number };
type Square = { readonly kind: 'square'; readonly side: number };
type Holder = { readonly shape: Circle | Square };

const square: Square = { kind: 'square', side: 2 };
const reshape = (h: Holder): Holder => Object.assign(h, { shape: square }); // rejected here: TS2550

const area = (h: Holder): number =>
  h.shape.kind === 'circle' ? reshape(h).shape.kind.length + h.shape.radius() : h.shape.side;

const holder: Holder = { shape: { kind: 'circle', radius: () => 1 } };
console.log(area(holder));
