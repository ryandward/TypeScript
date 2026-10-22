// witness: A readonly property widened into a writable index signature: the wider name overwrites it by key.
const fixed: { readonly label: string } = { label: 'x' };
const dict: { [k: string]: string | number } = fixed; // rejected here: TS2916
dict['label'] = 1; // rejected here: TS2904
console.log(fixed.label.toUpperCase());
