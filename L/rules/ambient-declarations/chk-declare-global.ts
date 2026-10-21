// witness: `declare global` adds a method to String that nothing implements.
declare global { // rejected here: TS2905
  interface String { // rejected here: TS2910
    shout(): string;
  }
}
console.log("a".shout());
export {};
