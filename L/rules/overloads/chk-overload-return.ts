// witness: The implementation returns a number where its overload promises a string.
function parse(input: string): string; // rejected here: TS2908
function parse(input: number): number; // rejected here: TS2908
function parse(input: string | number): string | number {
  return typeof input === "string" ? input.length : input.toFixed(1);
}
console.log(parse("abc").toUpperCase());
