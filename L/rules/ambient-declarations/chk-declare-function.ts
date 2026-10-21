// witness: `declare function` promises a global function that nothing defines.
declare function track(event: string): string; // rejected here: TS2905
console.log(track("x"));
