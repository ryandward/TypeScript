// rejected sound code: A function declaration called above its own line reads nothing declared after the call, so
// the program can't go wrong, but every read follows its declaration, the function's name included.
console.log(main()); // rejected here: TS2912
function main(): number {
  return 1;
}
