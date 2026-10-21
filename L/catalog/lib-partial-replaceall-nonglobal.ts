// witness: replaceAll accepts string | RegExp, but throws TypeError for a RegExp without the g flag.
const out: string = 'a-b'.replaceAll(/-/, '+');
console.log(out);
