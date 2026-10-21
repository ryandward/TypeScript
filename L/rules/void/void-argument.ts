// rejected sound code: A void result handed to a parameter typed void. The function can't use it, so nothing goes
// wrong here, but the result may hold anything, and a parameter typed void takes only undefined.
const takesVoid = (v: void): number => (typeof v === 'undefined' ? 0 : 1);
const discard: () => void = () => 42;
console.log(takesVoid(discard())); // rejected here: TS2911
