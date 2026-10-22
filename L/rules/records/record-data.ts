// control: A record is copied by naming each property, and Readonly of it is a record too; an iterator result, a
// plain object, is data a record may hold; and a library type such as ArrayLike takes an array.
type User = { readonly name: string; readonly age: number };
const user: User = { name: 'n', age: 1 };
const older: User = { name: user.name, age: user.age + 1 };
const frozen: Readonly<User> = user;
const copy: User = { name: frozen.name, age: frozen.age };
const result: { readonly done?: boolean; readonly value: unknown } = [1].values().next();
const count = (xs: ArrayLike<number>): number => xs.length;
console.log(older.age, copy.name, result.value, count([1, 2]));
