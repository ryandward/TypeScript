// control: A literal field tells the members of a union apart, both ways.
type Shape = { readonly kind: 'circle'; readonly r: number } | { readonly kind: 'square'; readonly side: number };
const area = (s: Shape): number => (s.kind === 'circle' ? 3 * s.r * s.r : s.side * s.side);
console.log(area({ kind: 'circle', r: 1 }), area({ kind: 'square', side: 2 }));
