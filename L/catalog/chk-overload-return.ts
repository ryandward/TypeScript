// witness: The implementation returns a number where its overload promises a string.
function parse(input: string): string;
function parse(input: number): number;
function parse(input: string | number): string | number {
  return typeof input === "string" ? input.length : input.toFixed(1);
}
console.log(parse("abc").toUpperCase());
