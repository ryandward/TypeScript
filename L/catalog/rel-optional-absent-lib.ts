// witness: propertiesRelatedTo / getUnmatchedProperty: an optional target property that the source type
// does not declare is skipped. Width subtyping to {} hides `transfer`, the lib's optional field re-exposes it.
const raw = { transfer: 5 };
const hidden: {} = raw;
const opts: StructuredSerializeOptions = hidden;
console.log(structuredClone('payload', opts));
