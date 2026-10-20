// control: A built-in constructor is declared with a construct signature, and a caught value is narrowed by it.
const caught: unknown = new Error('failed');
console.log(caught instanceof Error ? caught.message : 'not an error');
