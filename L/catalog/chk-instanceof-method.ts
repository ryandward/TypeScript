// witness: instanceof takes an object-literal method on the right, which has no prototype for it to read.
const checks = {
  widget(): boolean {
    return true;
  },
};
const probe: object = { a: 1 };
console.log(probe instanceof checks.widget);
