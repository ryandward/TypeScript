// witness: An object rest of a type parameter is typed through Omit of the parameter, which keeps an array's length,
// but the rest copies only the elements.
const strip = <T extends object>(t: T) => {
  const { ...rest } = t; // rejected here: TS2926
  return rest;
};
const n: number = strip([1, 2]).length;
console.log(n.toFixed(0));
