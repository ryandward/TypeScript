// The text is a number, so the parsed value happens to be one, but nothing checked it. The sound spelling takes
// the value as unknown and decides what it is.
const port: number = JSON.parse('8080'); // rejected here: TS2898
console.log(port + 1);
