// regression: The same read by a literal key. The release types it through the index signature and refuses the call;
// the lab typed it as Object's toString for one commit (b4491c5d3) and let the call through.
const counts: Readonly<Record<string, number>> = { toString: 5 };
console.log(counts['toString']()); // rejected here: TS2571
