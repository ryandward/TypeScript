// witness: Source and target are conditional types with identical extends types: the check types only need to
// be related in EITHER direction, so [A] and [B] with B extends A pass although they pick different branches.
function flip<A, B extends A>(x: [A] extends [string] ? number : string): [B] extends [string] ? number : string {
  return x;
}
console.log(flip<unknown, string>('hello').toFixed(1));
