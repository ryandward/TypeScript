// control: A Map viewed as a ReadonlyMap with readonly values: the view can't write.
const steps = new Map<string, string[]>([['a', ['x']]]);
const view: ReadonlyMap<string, readonly string[]> = steps;
console.log(view.size);
