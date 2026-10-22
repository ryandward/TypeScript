// witness: A __proto__ key gives an object literal Map.prototype, so it passes instanceof Map with none of a Map's
// internal state.
const tagged: unknown = { __proto__: Map.prototype }; // rejected here: TS2914
console.log(tagged instanceof Map ? tagged.size : 0);
