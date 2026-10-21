// witness: `declare global` adds a method to String that nothing implements.
declare global {
  interface String {
    shout(): string;
  }
}
console.log("a".shout());
export {};
