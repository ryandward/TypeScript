// witness: propertyRelatedTo ignores readonly outside strictSubtypeRelation, so a readonly property can be
// written through a mutable alias.
interface Frozen { readonly run: () => string }
interface Thawed { run: () => string | number }
const f: Frozen = { run: () => 'ok' };
const t: Thawed = f; // rejected here: TS2890
t.run = () => 5;
console.log(f.run().toUpperCase());
