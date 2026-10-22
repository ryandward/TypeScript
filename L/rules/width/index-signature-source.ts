// control: A source whose index signature covers the field says what the value there is, and it fits.
const counts: { readonly [key: string]: number } = { a: 1 };
const pick = (c: { readonly a?: number }): number => c.a ?? 0;
console.log(pick(counts));
