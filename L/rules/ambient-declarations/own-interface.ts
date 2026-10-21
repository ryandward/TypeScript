// control: An interface of the program's own, and the library's values, used as declared: nothing is promised that
// the program or the library doesn't hold.
interface Point { readonly x: number; readonly y: number }
const origin: Point = { x: 3, y: 4 };
console.log(Math.hypot(origin.x, origin.y));
