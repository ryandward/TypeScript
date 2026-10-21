// control: A readonly object passed where its field is writable. With nothing written, the receiver only reads.
function report(response: { IsComplete: boolean }): string { return String(response.IsComplete); }
const done: { readonly IsComplete: false } = { IsComplete: false };
console.log(report(done));
