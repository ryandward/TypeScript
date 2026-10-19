// A type-level question about tuples: no value exists, so nothing can be written through a wider name, and
// the answer is TypeScript's own.
type IsString<T> = [T] extends [string] ? true : false;
const answer: IsString<'a'> = true;
console.log(answer);
