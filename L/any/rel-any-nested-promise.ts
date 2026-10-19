// witness: Same any-source branch through Promise<any>: Response.json() is never read as `any` itself.
interface User { readonly name: string }
const user: User = await new Response('{"id": 1}').json(); // rejected here: TS2898
console.log(user.name.toUpperCase());
export {};
