// witness: Same branch with a user-declared optional method (the hook's 'optional field' rule is the only guard).
interface Hooks { readonly onDone?: () => string }
const raw = { onDone: 'not a function' };
const hidden: {} = raw;
const hooks: Hooks = hidden; // rejected here: TS2915
console.log(hooks.onDone?.());
