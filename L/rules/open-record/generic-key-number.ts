// control: A generic key bounded by number may miss but names no inherited member, so the read is the record's type or
// undefined, which the program handles.
const at = <I extends number>(xs: Readonly<Record<I, string>>, i: I): string => xs[i] ?? 'none';
console.log(at<number>({ 1: 'one' }, 2));
