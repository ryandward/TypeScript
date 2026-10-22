// control: A key a member requires is present in every value of it, so `in` false removes that member.
type Named = { readonly name: string };
type Runner = { readonly run: () => number };
const label = (x: Named | Runner): string => ('run' in x ? 'runner' : x.name);
console.log(label({ name: 'n' }), label({ run: () => 1 }));
