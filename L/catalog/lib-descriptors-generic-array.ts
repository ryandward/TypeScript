// witness: Object.getOwnPropertyDescriptors<T> maps T's properties to descriptors, and a mapped type over an array
// type is an array type, so the descriptors of an array are typed as an array with a length, but they are a record
// whose length is the length property's descriptor.
const describe = <T extends object>(t: T) => Object.getOwnPropertyDescriptors(t);
const n: number = describe([1, 2]).length;
console.log(n.toFixed(0));
