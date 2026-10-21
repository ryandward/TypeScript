// witness: A field initializer calls a method that reads a private field declared below it.
class Vault {
  readonly size: number = this.measure();
  readonly #secret: string = "s";
  measure(): number {
    return this.#secret.length;
  }
}
console.log(new Vault().size);
