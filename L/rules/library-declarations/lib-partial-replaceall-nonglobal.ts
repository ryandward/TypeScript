// witness: replaceAll accepts string | RegExp, but throws TypeError for a RegExp without the g flag.
const out: string = 'a-b'.replaceAll(/-/, '+'); // rejected here: TS2345
console.log(out);
