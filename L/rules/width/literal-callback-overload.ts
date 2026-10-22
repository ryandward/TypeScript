// control: An object literal beside a callback in an overloaded call keeps its type's claim to name every
// property, through the first pass of overload resolution.
const indices: readonly number[] = Array.from({ length: 3 }, (_, i) => i);
console.log(indices);
