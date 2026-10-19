// A library declares fields only to carry types, as zod's schemas carry `input` and `output`, and declares
// them writable. Widening such a schema is rejected. By L's boundary rule the fix is in our code: keep the
// schema's own type instead of widening it.
interface Internals<O, I> { output: O; input: I }
interface Schema<O = unknown, I = unknown> { readonly _zod: Internals<O, I> }
const pipe: Schema<string, { backend: string }> = { _zod: { output: 'x', input: { backend: 'x' } } };
const widened: Schema<string> = pipe; // rejected here
console.log(widened._zod.output);
