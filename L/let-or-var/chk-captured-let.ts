// witness: A let read by a hoisted function before it is assigned. TypeScript assumes a variable read from another function is
// initialized whenever it is assigned anywhere. In L every binding is assigned once, where it is declared, so the
// declaration without a value and the assignment after it are both rejected.
let host: string; // rejected here: TS2892
function describe(): string {
  return host.toUpperCase();
}
console.log(describe());
host = "example.com"; // rejected here: TS2893
