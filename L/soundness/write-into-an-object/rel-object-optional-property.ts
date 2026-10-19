// An optional property that admits undefined can store it, through the wider name, into a property the
// original says is always a string.
const box: { value: string } = { value: 'a' };
const wide: { value?: string | undefined } = box; // rejected here: TS2890
wide.value = undefined;
console.log(box.value.toUpperCase());
