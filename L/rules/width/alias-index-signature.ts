// rejected sound code: labels holds only title, but its type is open, so L infers no index signature for it, and it
// isn't a record of strings.
type Labels = { readonly title: string };
const labels: Labels = { title: 'a' };
const dict: { readonly [key: string]: string } = labels; // rejected here: TS2916
console.log(dict['title']);
