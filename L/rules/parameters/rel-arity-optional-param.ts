// witness: compareSignaturesRelated skips a parameter the target doesn't have, so a function with an optional
// parameter passes as one that takes none, which then passes as one that takes a number: the number lands in the
// parameter the second view forgot. (L-hooks' rel-arity-void-param reaches the same skip through a void parameter.)
const shout = (name?: string): string => (name !== undefined ? name.toUpperCase() : 'anon');
const noArgs: () => string = shout; // rejected here: TS2322
const wrongArgs: (n: number) => string = noArgs;
console.log(wrongArgs(5));
