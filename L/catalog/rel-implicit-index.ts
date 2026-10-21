// witness: typeRelatedToIndexInfo -> isObjectTypeWithInferableIndex: a type-literal type is given an implicit
// string index signature built from its declared properties, ignoring properties added by width subtyping.
type Labels = { readonly title: string; readonly body: string };
const raw = { title: 'T', body: 'B', count: 3 };
const labels: Labels = raw;
console.log(Object.values(labels).map((v) => v.toUpperCase()).join(','));
