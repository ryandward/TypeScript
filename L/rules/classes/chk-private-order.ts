// witness: A field initializer calls a method that reads a private field declared below it.
class Vault { // rejected here: TS2902
  readonly size: number = this.measure(); // rejected here: TS2903
  readonly #secret: string = "s";
  measure(): number {
    return this.#secret.length; // rejected here: TS2903
  }
}
console.log(new Vault().size);
