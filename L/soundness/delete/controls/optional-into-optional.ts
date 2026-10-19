// An optional property widened into an optional one: deleting it through the wider name is what the
// original already allows.
type Source = { label?: string };
const source: Source = { label: 'x' };
const wide: { label?: string } = source;
delete wide.label;
console.log(source.label ?? 'none');
