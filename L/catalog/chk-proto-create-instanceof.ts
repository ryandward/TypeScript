// witness: instanceof's true branch trusts the prototype chain, but Object.create builds an object on Map.prototype
// that no Map constructor initialized, and Map's getters throw on it.
const m: unknown = Object.create(Map.prototype);
console.log(m instanceof Map ? m.size : 0);
