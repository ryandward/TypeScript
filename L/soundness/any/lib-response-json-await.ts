// Body.json() is Promise<any>; the await is never a "read" of a top-level any.
type User = { readonly name: string };
const res: Response = new Response('{"id": 1}');
const user: User = await res.json(); // rejected here: TS2898
console.log(user.name.toUpperCase());
export {};
