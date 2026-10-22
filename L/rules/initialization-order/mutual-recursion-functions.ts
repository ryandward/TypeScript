// rejected sound code: Two function declarations that call each other read nothing a call could reach before it
// exists, but the first reads the second above the second's line. A record holding both is the spelling L reads.
function isEven(n: number): boolean {
  return n === 0 || isOdd(n - 1); // rejected here: TS2912
}
function isOdd(n: number): boolean {
  return n !== 0 && isEven(n - 1);
}
console.log(isEven(4));
