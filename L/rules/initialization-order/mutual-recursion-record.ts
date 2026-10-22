// control: Two functions that call each other, held in one record that each reads inside its own declaration.
const parity = {
  even: (n: number): boolean => n === 0 || parity.odd(n - 1),
  odd: (n: number): boolean => n !== 0 && parity.even(n - 1),
};
console.log(parity.even(4), parity.odd(4));
