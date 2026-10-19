// A predicate in a type is a requirement: the guard passed in must prove it, and assignment checks that.
const pick = <T, S extends T>(items: readonly T[], guard: (x: T) => x is S): readonly S[] => items.filter(guard);
console.log(pick([1, 'a'], (x) => typeof x === 'string').map((s) => s.toUpperCase()));
