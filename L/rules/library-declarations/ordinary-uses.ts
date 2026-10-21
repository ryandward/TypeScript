// control: The corrected declarations still type what code ordinarily does: Array.from over a list or with a map
// over a length, reduce from a start, replaceAll with a string, flatMap into a list, Map.groupBy, the whole match
// of an exec, and JSON.stringify read where it may be undefined.
const copy: readonly string[] = Array.from(['a', 'b']);
const indices: readonly number[] = Array.from({ length: 3 }, (_, i) => i);
const total: number = indices.reduce((a, b) => a + b, 0);
const replaced: string = 'a-b'.replaceAll('-', '+');
const doubled: readonly string[] = copy.values().flatMap((w) => [w, w]).toArray();
const byLength: ReadonlyMap<boolean, readonly number[]> = Map.groupBy(indices, (n) => n > 0);
const found = /(a)|(b)/.exec('b');
const whole: string = found === null ? '' : found[0];
const text: string | undefined = JSON.stringify({ total });
console.log(copy, total, replaced, doubled, byLength.size, whole, text);
