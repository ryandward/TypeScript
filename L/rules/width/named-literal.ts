// rejected sound code: raw holds exactly the literal written for it, but its type names only next, and another
// value of that type may hold anything at return, so L doesn't take it as an Iterator. Annotating the literal is the
// spelling L reads.
const raw = { next: (): IteratorResult<number> => ({ done: true, value: undefined }) };
const it: Iterator<number> = raw; // rejected here: TS2915
console.log(it.next().done);
