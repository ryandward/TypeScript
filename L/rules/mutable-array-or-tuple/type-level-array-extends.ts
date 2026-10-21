// control: A type-level question about arrays: the answer is TypeScript's own.
type IsStrings<T> = T extends string[] ? true : false;
const answer: IsStrings<'a'[]> = true;
console.log(answer);
