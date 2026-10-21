// rejected sound code: Deleting a property the value's own type says is optional: every reader already handles its
// absence. It can't go wrong, but the core changes no object in place.
const box: { label?: string } = { label: 'x' };
delete box.label; // rejected here: TS2904
console.log(box.label ?? 'none');
