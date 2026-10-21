// control: Presence checked instead of asserted: the checker narrows the element after the check.
const names: readonly string[] = ['ana'];
const first = names[0];
if (first !== undefined) console.log(first.toUpperCase());
