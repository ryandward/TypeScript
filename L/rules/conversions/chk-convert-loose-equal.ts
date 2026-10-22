// witness: == with a number converts an object operand with ToPrimitive.
type Named = { readonly name: string };
const raw = { name: 'n', toString: 5, valueOf: 6 };
const named: Named = raw;
const pick = (x: number | Named): boolean => x == 1; // rejected here: TS2922
console.log(pick(named));
