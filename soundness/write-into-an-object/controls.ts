// Programs the write-into-an-object decision must keep accepting. Each runs without throwing.

// A readonly property widened: the wider name can't store through it.
function readonlyProperty(): string | number {
  const box: { readonly value: string } = { value: 'a' };
  const wide: { readonly value: string | number } = box;
  return wide.value;
}

// A fresh object literal given a wider type: no narrower name exists to break.
function freshLiteral(): string | number {
  const wide: { value: string | number } = { value: 'a' };
  wide.value = 1;
  return wide.value;
}

// Assigning to an ordinary field narrows it, and the field really holds what was assigned.
function fieldNarrowing(): string {
  const o: { value: string | number } = { value: 1 };
  o.value = 'warm';
  return o.value.toUpperCase();
}

// A check on a readonly field narrows it: a field is storage, unlike an accessor.
type Circle = { readonly kind: 'circle'; readonly radius: number };
type Square = { readonly kind: 'square'; readonly side: number };
function fieldCheck(shape: Circle | Square): number {
  return shape.kind === 'circle' ? shape.radius : shape.side;
}

console.log(readonlyProperty(), freshLiteral(), fieldNarrowing(), fieldCheck({ kind: 'circle', radius: 1 }));
