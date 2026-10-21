// witness: Target has a METHOD signature, so its parameter is compared bivariantly.
interface Sink { put(x: string | number): number }
const strings = { put: (x: string): number => x.toUpperCase().length };
const sink: Sink = strings;
console.log(sink.put(42));
