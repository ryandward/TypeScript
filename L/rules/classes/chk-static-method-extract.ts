// witness: A static method that reads this is passed to map without its class, so this is undefined.
class Units { // rejected here: TS2902
  static readonly suffix: string = "px";
  static format(n: number): string {
    return String(n).concat(this.suffix.toLowerCase()); // rejected here: TS2903
  }
}
const values: readonly number[] = [1, 2];
console.log(values.map(Units.format));
