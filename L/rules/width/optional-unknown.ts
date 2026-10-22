// control: An optional field of type unknown holds whatever a value may carry there, so any record passes.
type Tagged = { readonly name: string; readonly meta?: unknown };
type Named = { readonly name: string };
const show = (t: Tagged): string => t.name;
const named: Named = { name: 'n' };
console.log(show(named));
