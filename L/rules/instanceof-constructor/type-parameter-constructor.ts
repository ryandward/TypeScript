// control: A type parameter bounded by a construct signature promises a prototype through its constraint.
const isInstance = <C extends abstract new (...args: never) => object>(ctor: C, value: object): boolean =>
  value instanceof ctor;
class Point {
  readonly x: number = 0;
}
console.log(isInstance(Point, new Point()));
