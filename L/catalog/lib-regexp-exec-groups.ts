// witness: RegExpExecArray extends Array<string>, but a capture group that did not take part is undefined.
const matches: readonly (readonly string[])[] = Array.from('b'.matchAll(/(a)|(b)/g));
console.log(matches.map((m) => m.map((group) => group.length)));
