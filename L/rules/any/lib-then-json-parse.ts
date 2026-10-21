// witness: then(JSON.parse) infers TResult = any, giving Promise<any>, and the await is not checked.
type Point = { readonly x: number };
const point: Point = await Promise.resolve('{"y": 1}').then(JSON.parse); // rejected here: TS2898
console.log(point.x.toFixed(1));
export {};
