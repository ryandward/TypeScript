// witness: getMinArgumentCount treats a trailing parameter whose type contains void as optional, and
// compareSignaturesRelated only rejects a source whose MIN argument count exceeds the target's
// parameter count. The parameter is forgotten, then re-added with a different type.
const shout = (name: string | void): string => (typeof name !== 'undefined' ? name.toUpperCase() : 'anon');
const noArgs: () => string = shout;
const wrongArgs: (n: number) => string = noArgs;
console.log(wrongArgs(5));
