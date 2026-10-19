// rejected sound code: The text is a number, so the assertion happens to be true, but nothing checks it. The sound spelling
// decodes the parsed value.
const port = JSON.parse('8080') as number; // rejected here: TS2896
console.log(port + 1);
