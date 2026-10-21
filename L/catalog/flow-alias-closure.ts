// witness: The discriminant alias also narrows inside a closure whose flow starts at the closure,
// even though the closed-over parameter is reassigned before the closure runs.
type Circle = { readonly kind: 'circle'; readonly radius: () => number };
type Square = { readonly kind: 'square'; readonly side: number };

const measure = (s: Circle | Square, next: Circle | Square): number => {
  const kind = s.kind;
  const later = (): number => (kind === 'circle' ? s.radius() : 0);
  s = next;
  return later();
};
console.log(measure({ kind: 'circle', radius: () => 1 }, { kind: 'square', side: 2 }));
