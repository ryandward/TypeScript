// witness: A mapped type over K is indexed by a key of type K, and K is inferred as string from the key, so the
// table needn't hold it.
type Labels<K extends string> = { readonly [P in K]: string };
function label<K extends string>(table: Labels<K>, key: K): string {
  return table[key].toUpperCase();
}
const asked: string = "zzz";
console.log(label({ a: "alpha" }, asked));
