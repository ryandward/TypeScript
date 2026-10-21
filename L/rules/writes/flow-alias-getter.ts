// witness: Aliased condition through a get-only accessor: isConstantReference accepts obj.prop when
// isReadonlySymbol(prop), and a getter without a setter counts as readonly, so the alias is
// inlined at the later use even though the getter is re-run there.
type Circle = { readonly kind: 'circle'; readonly radius: () => number };
type Square = { readonly kind: 'square'; readonly side: number };

// The getter's state is an iterator it advances, the one state a core module can still change.
const reads = [1, 2, 3].values();
const f = {
  get shape(): Circle | Square {
    return reads.next().value === 1 ? { kind: 'circle', radius: () => 1 } : { kind: 'square', side: 2 };
  },
};
const isCircle = f.shape.kind === 'circle';
console.log(isCircle ? f.shape.radius() : 0); // rejected here: TS2339
