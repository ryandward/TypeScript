// witness: A tagged template calls its tag, and a tag typed Function has no signature to check the call against, so a
// constructor held as one is called without new.
const tag: Function = Map;
console.log(tag`x`); // rejected here: TS2349
