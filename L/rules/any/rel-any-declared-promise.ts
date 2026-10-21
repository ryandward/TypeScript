// witness: A function declared to return Promise<any>, as the DOM declares Response.json: the await gives any,
// which flows into an interface.
type User = { readonly name: string };
const load = async (): Promise<any> => JSON.parse('{"id": 1}');
const user: User = await load(); // rejected here: TS2898
console.log(user.name.toUpperCase());
export {};
