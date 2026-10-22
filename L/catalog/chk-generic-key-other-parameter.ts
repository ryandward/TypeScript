// witness: A Record over T is indexed by a key of type K extends T, and the caller picks T and K as string, so the
// table needn't hold the key.
function lookup<T extends string, K extends T>(table: Readonly<Record<T, string>>, key: K): string {
  return table[key].toUpperCase(); // TypeError: Cannot read properties of undefined (reading 'toUpperCase')
}
const wanted: string = 'c';
console.log(lookup<string, string>({ a: 'alpha' }, wanted));
