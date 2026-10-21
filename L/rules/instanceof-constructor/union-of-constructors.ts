// control: A union of two built-in constructors whose construct signatures differ has none of its own, but each
// member has one, so each promises a prototype.
const useMap: boolean = 'x'.length > 0;
const pick: typeof Map | typeof Set = useMap ? Map : Set;
const value: object = new Map<string, number>();
console.log(value instanceof pick);
