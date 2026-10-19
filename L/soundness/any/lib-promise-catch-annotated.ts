// catch's onrejected takes reason: any, so the callback may annotate it as anything.
const failing: Promise<number> = Promise.reject('plain string');
const handled: Promise<number> = failing.catch((err: Error) => err.message.length); // rejected here: TS2898
console.log(await handled);
export {};
