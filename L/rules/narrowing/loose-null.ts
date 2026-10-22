// control: == null holds of null and undefined and nothing else, so it narrows both away.
const text = (x: string | null | undefined): string => (x == null ? '' : x.toUpperCase());
console.log(text('a'), text(null), text(undefined));
