// isPropertySymbolTypeRelated relates a writable property in one direction only, so { value: string }
// is accepted as { value: string | number } and the wider name stores a number.
const box: { value: string } = { value: 'a' };
const wide: { value: string | number } = box; // rejected here: TS2890
wide.value = 1;
console.log(box.value.toUpperCase());
