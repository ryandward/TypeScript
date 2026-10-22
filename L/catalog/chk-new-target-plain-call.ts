// witness: checkNewTargetMetaProperty types new.target in a function as the function's own type, but a plain call
// leaves it undefined.
function named(): string {
  // Runtime: TypeError: Cannot read properties of undefined (reading 'name')
  return new.target.name;
}
console.log(named());
