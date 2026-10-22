// control: A function that takes fewer parameters than its type passes ignores the rest, and nothing it requires is
// left out.
const doubled: readonly number[] = [1, 2].map((n) => n * 2);
const first: (a: number, b: number) => number = (a) => a;
console.log(doubled, first(1, 2));
