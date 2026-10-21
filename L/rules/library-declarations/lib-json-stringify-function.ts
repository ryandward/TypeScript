// witness: JSON.stringify is declared to return string, but returns undefined for a function.
const handler = (): number => 1;
const text: string = JSON.stringify(handler); // rejected here: TS2322
console.log(text.length);
