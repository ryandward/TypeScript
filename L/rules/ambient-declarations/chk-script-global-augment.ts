// witness: No import/export, so this file is a script and the interface merges into the lib's global String.
interface String { // rejected here: TS2910
  shout(): string;
}
console.log("a".shout());
