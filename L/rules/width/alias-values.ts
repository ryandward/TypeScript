// rejected sound code: labels holds only title, but its type is open, so it has no index signature to read its
// values by, and Object.values falls to the overload that returns any[].
type Labels = { readonly title: string };
const labels: Labels = { title: 'a' };
const parts: readonly string[] = Object.values(labels); // rejected here: TS2898
console.log(parts.length);
