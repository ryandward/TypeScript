// witness: Alias of a discriminant (`const k = obj.kind`) is honoured by getCandidateDiscriminantPropertyAccess
// without isConstantReference, so it keeps narrowing obj after obj itself is reassigned.
// Parameter reassignment is an identifier write, which the hook does not treat as a write.
type Circle = { readonly kind: 'circle'; readonly radius: () => number };
type Square = { readonly kind: 'square'; readonly side: number };

const measure = (s: Circle | Square, next: Circle | Square): number => {
  const kind = s.kind;
  s = next;
  return kind === 'circle' ? s.radius() : 0;
};
console.log(measure({ kind: 'circle', radius: () => 1 }, { kind: 'square', side: 2 }));
