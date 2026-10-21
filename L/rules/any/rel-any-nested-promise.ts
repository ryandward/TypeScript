// witness: Promise<any> relates to Promise<User> because Promise's type argument is related through its variance,
// and any relates to User. then(JSON.parse) infers Promise<any>, and nothing awaits it before the relation.
interface User { readonly name: string }
const pending: Promise<User> = Promise.resolve('{"id": 1}').then(JSON.parse); // rejected here: TS2898
console.log((await pending).name.toUpperCase());
export {};
