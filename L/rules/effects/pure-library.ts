// control: What the ES library computes from its arguments alone stays: Math's functions, JSON, promises,
// collections and the iterator helpers.
const largest = Math.max(1, 2, Math.floor(2.5));
const text = JSON.stringify({ largest });
const lengths: ReadonlyMap<string, number> = new Map([['a', 1]]);
console.log(text, lengths.size, await Promise.resolve(largest), [1, 2].values().map((n) => n * 2).toArray());
export {};
