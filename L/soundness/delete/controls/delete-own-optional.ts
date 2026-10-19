// Deleting a property the value's own type says is optional: every reader already handles its absence.
const box: { label?: string } = { label: 'x' };
delete box.label;
console.log(box.label ?? 'none');
