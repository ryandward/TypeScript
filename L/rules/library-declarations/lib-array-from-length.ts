// witness: Array.from<T>(arrayLike: ArrayLike<T>) infers T from the annotation; { length } has no elements.
const cells: readonly string[] = Array.from({ length: 2 }); // rejected here: TS2322
console.log(cells.map((c) => c.trim()));
