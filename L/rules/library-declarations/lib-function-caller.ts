// witness: Function declares caller as a Function, but reading caller on a strict-mode function throws, and every
// function in a module is strict.
const double = (n: number): number => n * 2;
const caller: Function = double.caller; // rejected here: TS2339
console.log(caller.name);
