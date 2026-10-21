// witness: No import/export, so this file is a script and the interface merges into the lib's global String.
interface String {
  shout(): string;
}
console.log("a".shout());
