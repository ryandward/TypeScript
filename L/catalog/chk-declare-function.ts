// witness: `declare function` promises a global function that nothing defines.
declare function track(event: string): string;
console.log(track("x"));
