// The same swap one level down: an array inside a writable property, related through the property.
const holder: { inner: string[] } = { inner: ['a'] };
const wide: { inner: (string | number)[] } = holder; // rejected here: TS2891
wide.inner.push(1);
console.log(holder.inner.map((s) => s.toUpperCase()).join(','));
