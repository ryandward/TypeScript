// rejected sound code: An ambient declaration of a global the host provides, as `declare var console: Console` does
// in TypeScript's DOM library. Under Node the program can't go wrong, but the core has no host, and outside the
// library L has no ambient declarations.
declare var configuredHost: string | undefined; // rejected here: TS2905
console.log(typeof configuredHost);
