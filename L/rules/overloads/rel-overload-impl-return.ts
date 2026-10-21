// witness: isImplementationCompatibleWithOverload: return types only need to be related in EITHER
// direction, so an implementation returning unknown can back an overload that promises number.
function parse(x: string): number; // rejected here: TS2908
function parse(x: unknown): unknown {
  return x;
}
console.log(parse('abc').toFixed(1));
