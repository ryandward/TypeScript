// witness: Aliased condition through a get-only accessor: isConstantReference accepts obj.prop when
// isReadonlySymbol(prop), and a getter without a setter counts as readonly, so the alias is
// inlined at the later use even though the getter is re-run there.
type Circle = { readonly kind: 'circle'; readonly radius: () => number };
type Square = { readonly kind: 'square'; readonly side: number };

const reads = new Set<number>();
const f = {
  get shape(): Circle | Square {
    reads.add(reads.size);
    return reads.size === 1 ? { kind: 'circle', radius: () => 1 } : { kind: 'square', side: 2 };
  },
};
const isCircle = f.shape.kind === 'circle';
console.log(isCircle ? f.shape.radius() : 0);
