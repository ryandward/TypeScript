// witness: A Record over K is indexed by a key of type K, and K is inferred as string from the key, so the table
// needn't hold it.
function lookup<K extends string>(table: Readonly<Record<K, string>>, key: K): string {
  return table[key].toUpperCase();
}
const labels = { a: "alpha", b: "beta" };
const wanted: string = "c";
console.log(lookup(labels, wanted));
