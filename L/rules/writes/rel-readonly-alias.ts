// witness: propertyRelatedTo ignores readonly outside strictSubtypeRelation, so a readonly property can be
// written through a mutable alias.
interface Frozen { readonly run: () => string }
interface Thawed { run: () => string | number }
const f: Frozen = { run: () => 'ok' };
const t: Thawed = f;
t.run = () => 5; // rejected here: TS2904
console.log(f.run().toUpperCase());
