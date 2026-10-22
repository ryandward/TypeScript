// control: A record built from literals keeps every field through a spread, Readonly of it too; an array's spread
// keeps its entries and a tuple's its elements; an iterator result, a plain object, is data a record may hold; and a
// library type such as ArrayLike takes an array.
type User = { readonly name: string; readonly age: number };
const user: User = { name: 'n', age: 1 };
const older: User = { ...user, age: user.age + 1 };
const frozen: Readonly<User> = user;
const copy: User = { ...frozen };
const entries = { ...[1, 2] };
const pair = { ...([1, 'a'] as const) };
const result: { readonly done?: boolean; readonly value: unknown } = [1].values().next();
const count = (xs: ArrayLike<number>): number => xs.length;
console.log(older.age, copy.name, entries[0], pair[1], result.value, count([1, 2]));
