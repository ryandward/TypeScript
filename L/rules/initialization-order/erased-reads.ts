// control: A read the emitter erases runs nothing: a computed name in a type literal and in an interface, and a
// typeof, each naming a const declared below.
const f = (): number => {
  type Keyed = { readonly [key]: number };
  interface Named { readonly [key]: string }
  const n: Keyed[typeof key] = 1;
  const s: Named[typeof key] = 's';
  return n + s.length;
};
console.log(f());
const key = 'k';
