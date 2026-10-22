// rejected sound code: The literal has no own __proto__ and the program never reads it, but every object inherits
// one, so L doesn't take the literal as holding a string or nothing there.
const hooks: { readonly __proto__?: string; readonly name: string } = { name: 'n' }; // rejected here: TS2915
console.log(hooks.name);
