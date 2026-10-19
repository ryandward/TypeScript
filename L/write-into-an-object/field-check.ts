// control: A check on a readonly field narrows it: a field is storage, unlike an accessor.
type Circle = { readonly kind: 'circle'; readonly radius: number };
type Square = { readonly kind: 'square'; readonly side: number };
function size(shape: Circle | Square): number {
  return shape.kind === 'circle' ? shape.radius : shape.side;
}
console.log(size({ kind: 'circle', radius: 1 }));
