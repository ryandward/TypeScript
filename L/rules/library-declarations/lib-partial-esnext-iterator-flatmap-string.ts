// witness: IteratorObject.flatMap accepts Iterable<U>, which includes string, but the runtime rejects strings.
const letters: readonly string[] = ['ab', 'cd'].values().flatMap((word: string) => word).toArray(); // rejected here: TS2345
console.log(letters.length);
