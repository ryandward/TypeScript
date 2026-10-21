// witness: A get accessor is narrowed like a field (getFlowTypeOfAccessExpression accepts
// SymbolFlagsAccessor), but each read runs the getter again.
type Circle = { readonly kind: 'circle'; readonly radius: () => number };
type Square = { readonly kind: 'square'; readonly side: number };

// The getter's state is an iterator it advances, the one state a core module can still change.
const reads = [1, 2, 3].values();
const f = {
  get shape(): Circle | Square {
    return reads.next().value === 1 ? { kind: 'circle', radius: () => 1 } : { kind: 'square', side: 2 };
  },
};

console.log(f.shape.kind === 'circle' ? f.shape.radius() : f.shape.side); // rejected here: TS2339
