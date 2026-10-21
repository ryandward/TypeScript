// witness: Same hole through a destructured alias: `const { kind } = s` is accepted as an alias for
// s.kind (BindingElement branch of getCandidateDiscriminantPropertyAccess).
type Circle = { readonly kind: 'circle'; readonly radius: () => number };
type Square = { readonly kind: 'square'; readonly side: number };

const measure = (s: Circle | Square, next: Circle | Square): number => {
  const { kind } = s;
  s = next; // rejected here: TS2893
  return kind === 'circle' ? s.radius() : 0;
};
console.log(measure({ kind: 'circle', radius: () => 1 }, { kind: 'square', side: 2 }));
