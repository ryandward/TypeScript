// witness: A static method that reads this is passed to map without its class, so this is undefined.
class Units {
  static readonly suffix: string = "px";
  static format(n: number): string {
    return String(n).concat(this.suffix.toLowerCase());
  }
}
const values: readonly number[] = [1, 2];
console.log(values.map(Units.format));
