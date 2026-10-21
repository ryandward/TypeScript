// witness: `declare const` promises a global value that nothing defines.
declare const BUILD_ID: string; // rejected here: TS2905
console.log(BUILD_ID.toUpperCase());
