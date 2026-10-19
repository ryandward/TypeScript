// A readonly object passed where its field is writable: the receiver could set it. Rejected even when the
// receiver only reads; the fix is to declare the receiver's field readonly.
function report(response: { IsComplete: boolean }): string { return String(response.IsComplete); }
const done: { readonly IsComplete: false } = { IsComplete: false };
console.log(report(done)); // rejected here: TS2890
