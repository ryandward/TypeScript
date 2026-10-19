// witness: The same swap through a return type wider than the array returned.
function widen(strings: string[]): (string | number)[] {
  return strings; // rejected here: TS2891
}
const strings: string[] = ['a'];
widen(strings).push(1);
console.log(strings.map((s) => s.toUpperCase()).join(','));
