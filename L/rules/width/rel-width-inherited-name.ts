// witness: The width rule took a source's index signature to say what it holds at a name it doesn't declare, but at
// __proto__, an inherited name Object's declaration doesn't list, every object holds Object.prototype.
const table: { readonly [k: string]: string } = { a: 'x' };
const hooks: { readonly __proto__?: string } = table; // rejected here: TS2915
console.log(hooks.__proto__?.toUpperCase());
