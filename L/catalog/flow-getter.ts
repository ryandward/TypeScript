// witness: A get accessor is narrowed like a field (getFlowTypeOfAccessExpression accepts
// SymbolFlagsAccessor), but each read runs the getter again.
type Circle = { readonly kind: 'circle'; readonly radius: () => number };
type Square = { readonly kind: 'square'; readonly side: number };

const reads = new Set<number>();
class Flipper {
  get shape(): Circle | Square {
    reads.add(reads.size);
    return reads.size === 1 ? { kind: 'circle', radius: () => 1 } : { kind: 'square', side: 2 };
  }
}

const f = new Flipper();
console.log(f.shape.kind === 'circle' ? f.shape.radius() : f.shape.side);
