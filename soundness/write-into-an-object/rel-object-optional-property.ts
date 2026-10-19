// An optional property on the wider name can store undefined into a property the original says is
// always a string.
const box: { value: string } = { value: 'a' };
const wide: { value?: string } = box; // rejected here
wide.value = undefined;
console.log(box.value.toUpperCase());
