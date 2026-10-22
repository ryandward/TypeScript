// control: A function reads itself inside its own declaration: it can only be running once it exists.
const count = (n: number): number => (n === 0 ? 0 : 1 + count(n - 1));
function depth(n: number): number {
  return n === 0 ? 0 : 1 + depth(n - 1);
}
console.log(count(3), depth(3));
