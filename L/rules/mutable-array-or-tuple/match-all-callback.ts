// control: A library callback whose parameter is a mutable array, as Array.from hands each list in a list of lists
// to its map function.
const pairs: readonly (readonly number[])[] = [[1, 2], [3, 4]];
console.log(Array.from(pairs.map((pair) => [...pair]), (pair) => pair.length).join(','));
