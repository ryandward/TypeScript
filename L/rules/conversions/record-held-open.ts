// rejected sound code: named holds a literal with no toString of its own, so the template finds Object's, but its
// type is open, and another value of it may hold its own.
type Named = { readonly name: string };
const named: Named = { name: 'n' };
console.log(`${named}`); // rejected here: TS2922
