// witness: A Set's has passed as a callback is called alone, with no this, and the engine refuses it.
const s = new Set(['a']);
console.log(['a'].filter(s.has)); // rejected here: TS2924
