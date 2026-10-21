// control: A directive's words inside a string, and a comment that names one without being one: nothing is
// suppressed.
const note: string = '// @ts-ignore'; // explains @ts-expect-error without being it
console.log(note.length);
