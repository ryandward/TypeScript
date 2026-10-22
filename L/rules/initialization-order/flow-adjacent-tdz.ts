// witness: checkIdentifier and isBlockScopedNameDeclaredBeforeUse: a const read
// inside a function is assumed initialized, so calling the function before the declaration runs
// reads the binding in its temporal dead zone.
const greet = (): number => banner.length; // rejected here: TS2912
console.log(greet());
const banner = 'hello';
