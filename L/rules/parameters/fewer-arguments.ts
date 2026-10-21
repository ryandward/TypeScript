// control: A callback that takes fewer arguments than its caller passes: JavaScript drops the rest, and the
// callback can read none of them.
const doubled: readonly number[] = [1, 2].map((n) => n * 2);
console.log(doubled);
