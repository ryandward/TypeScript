// witness: An Error passes as a record with a message, but an error's message is own and not enumerable, so a spread
// of the record copies nothing there.
type Message = { readonly message: string };
const held: Message = new Error('boom'); // rejected here: TS2923
const copy: Message = { ...held };
const m: string = copy.message;
if (typeof m !== 'string') throw new TypeError(`message is ${typeof m}`);
console.log(m);
