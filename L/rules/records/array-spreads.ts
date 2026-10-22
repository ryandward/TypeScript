// control: An array's and a tuple's rest, an array's spread and a call's spread iterate their value instead of copying
// its properties, and an object pattern without a rest reads properties one by one.
type User = { readonly name: string; readonly age: number };
const ids: readonly number[] = [1, 2, 3];
const [head, ...tail] = ids;
const pair: readonly [number, string, boolean] = [1, 'a', true];
const [n, ...others] = pair;
const joined: readonly number[] = [...ids, ...tail, 4];
const sum = (...xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const user: User = { name: 'n', age: 1 };
const { name, age } = user;
console.log(head, tail, n, others, joined, sum(...ids), name, age);
