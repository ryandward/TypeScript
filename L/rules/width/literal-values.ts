// control: An object literal names every property it has, so Object.values reads its values at their type.
const parts: readonly string[] = Object.values({ title: 'a', body: 'b' });
console.log(parts.map((s) => s.toUpperCase()));
