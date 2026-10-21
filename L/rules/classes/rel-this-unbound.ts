// witness: compareSignaturesRelated only compares `this` when the SOURCE signature declares a this parameter.
// A class method that reads `this` has none, so it passes as a free (x: string) => string callback.
class Greeter { // rejected here: TS2902
  readonly prefix: string = 'hi ';
  greet(name: string): string {
    return this.prefix.toUpperCase() + name; // rejected here: TS2903
  }
}
const g = new Greeter();
console.log(['ann', 'bob'].map(g.greet).join(','));
