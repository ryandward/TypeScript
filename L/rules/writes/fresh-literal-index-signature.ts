// control: A fresh object literal against a writable index signature, in a union as HeadersInit is: nothing else
// holds it.
const headers: Record<string, string> | [string, string][] = { 'Content-Type': 'application/json' };
console.log(Array.isArray(headers));
