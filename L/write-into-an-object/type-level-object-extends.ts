// control: A type-level question about an object: no value exists, and the answer is TypeScript's own.
type Wrap<T> = { value: T };
type IsWrapString<T> = T extends Wrap<string> ? true : false;
const answer: IsWrapString<Wrap<'a'>> = true;
console.log(answer);
