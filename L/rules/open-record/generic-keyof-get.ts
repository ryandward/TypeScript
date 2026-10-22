// rejected sound code: The program reads a key the object has, but K extends keyof T may be a bare string when T is a
// dictionary, so the read is unknown, which isn't a T[K].
const get = <T, K extends keyof T>(o: T, k: K): T[K] => o[k]; // rejected here: TS2322
console.log(get({ a: 1 }, 'a'));
