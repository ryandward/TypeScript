// witness: checkNewTargetMetaProperty types new.target in a function as the function's own type, but a plain call
// leaves it undefined, and calling it throws.
function named(): string {
  // Runtime: TypeError: new.target is not a function
  return new.target(); // rejected here: TS2722
}
console.log(named());
