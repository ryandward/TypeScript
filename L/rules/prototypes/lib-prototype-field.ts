// witness: The library types Map.prototype as a Map, but it is the object Maps inherit from, with none of a Map's
// internal state, and Map's size getter throws on it.
console.log(Map.prototype.size); // rejected here: TS2339
