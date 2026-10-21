// rejected sound code: An optional property widened into an optional one, then deleted: the original already allows
// its absence. It can't go wrong, but the core changes no object in place.
type Source = { label?: string };
const source: Source = { label: 'x' };
const wide: { label?: string } = source;
delete wide.label; // rejected here: TS2904
console.log(source.label ?? 'none');
