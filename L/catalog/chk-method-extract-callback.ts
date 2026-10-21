// witness: A class method is passed to map without its object, so this is undefined when it runs.
class Formatter {
  constructor(readonly prefix: string) {}
  format(word: string): string {
    return this.prefix.concat(word);
  }
}
const fmt = new Formatter("> ");
const words: readonly string[] = ["a", "b"];
console.log(words.map(fmt.format));
