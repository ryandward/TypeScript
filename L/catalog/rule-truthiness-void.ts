// witness: A function returning 42 is typed as returning void, then widened to return string | void, so a truthy
// result is read as a string.
const produce: () => void = () => 42;
const widened: () => string | void = produce;
const result = widened();
console.log(result ? result.toUpperCase() : 'none');
