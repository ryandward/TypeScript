// control: A function returning a number viewed as one returning void: a caller of the view discards the result.
const discard: () => void = () => 42;
console.log(typeof discard);
