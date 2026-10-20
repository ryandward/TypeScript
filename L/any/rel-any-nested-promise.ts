// witness: Promise<any> relates to Promise<User> because Promise's type argument is related through its variance,
// and any relates to User. Response.json() returns Promise<any>, and nothing awaits it before the relation.
interface User { readonly name: string }
const pending: Promise<User> = new Response('{"id": 1}').json(); // rejected here: TS2898
console.log((await pending).name.toUpperCase());
export {};
