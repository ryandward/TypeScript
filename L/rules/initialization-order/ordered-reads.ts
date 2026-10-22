// control: Every read follows its declaration: a const read inside a function declared below it, and a function
// declaration called below its own line.
const base = 10;
const scale = (n: number): number => n * base;
function twice(n: number): number {
  return scale(scale(n));
}
console.log(twice(1));
