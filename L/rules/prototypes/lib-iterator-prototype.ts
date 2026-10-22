// witness: TypeScript gives every class a prototype typed as its instance, and the library declares Iterator as a
// class, but Iterator.prototype has the helpers and no next.
const it = Iterator.prototype; // rejected here: TS2339
console.log(it.next());
