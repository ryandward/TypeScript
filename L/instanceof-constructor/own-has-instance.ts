// control: An object with a Symbol.hasInstance method of its own decides instanceof itself, without a prototype.
const isEmpty = {
  [Symbol.hasInstance](value: unknown): boolean {
    return typeof value === 'object' && value !== null && Object.keys(value).length === 0;
  },
};
const value: object = {};
console.log(value instanceof isEmpty);
