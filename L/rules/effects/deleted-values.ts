// rejected sound code: Each line runs an effect: it reads the clock, runs code from a string, observes the garbage
// collector or shares memory between threads. None can go wrong, but the core performs no effects, so the library
// keeps each type and has no value for it.
console.log(Date.now() > 0); // rejected here: TS2693
const made = new Function('return 1'); // rejected here: TS2693
const held = new WeakRef({ n: 1 }); // rejected here: TS2693
const registry = new FinalizationRegistry((n: number) => n); // rejected here: TS2693
const shared = new SharedArrayBuffer(4); // rejected here: TS2693
console.log(Atomics.add(new Int32Array(4), 0, 1)); // rejected here: TS2693
console.log(typeof made, typeof held, typeof registry, typeof shared);
