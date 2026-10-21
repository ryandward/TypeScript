// witness: Array.fromAsync<T>(ArrayLike<T>) has the same { length } hole as Array.from.
const cells: readonly string[] = await Array.fromAsync({ length: 2 });
console.log(cells.map((c) => c.trim()));
export {};
