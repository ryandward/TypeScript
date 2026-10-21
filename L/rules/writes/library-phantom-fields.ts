// control: A library declares fields only to carry types, as zod's schemas carry input and output, and declares
// them writable. With nothing written, the schema widens.
interface Internals<O, I> { output: O; input: I }
interface Schema<O = unknown, I = unknown> { readonly _zod: Internals<O, I> }
const pipe: Schema<string, { backend: string }> = { _zod: { output: 'x', input: { backend: 'x' } } };
const widened: Schema<string> = pipe;
console.log(widened._zod.output);
