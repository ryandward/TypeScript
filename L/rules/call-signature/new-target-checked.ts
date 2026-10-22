// control: new.target in a function is the function or undefined, and the function tells which.
function made(): string {
  return new.target === undefined ? 'called' : 'constructed';
}
console.log(made());
