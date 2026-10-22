// control: The empty object type {} holds every value but null and undefined, primitives included.
const present = (x: {}): string => String(x);
console.log(present(1), present('a'), present({}));
