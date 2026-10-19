// witness: Object.values on an interface (no implicit index signature) falls to values(o: {}): any[].
interface Row { readonly label: string; readonly count: number }
const row: Row = { label: 'a', count: 3 };
const labels: readonly string[] = Object.values(row); // rejected here: TS2898
console.log(labels.map((s) => s.toUpperCase()));
