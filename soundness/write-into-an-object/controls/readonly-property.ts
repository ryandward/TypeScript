// A readonly property widened: the wider name can't store through it.
const box: { readonly value: string } = { value: 'a' };
const wide: { readonly value: string | number } = box;
console.log(wide.value);
