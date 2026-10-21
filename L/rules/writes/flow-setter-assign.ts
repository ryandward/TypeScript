// witness: Assignment narrowing of a property reads the assigned value as the new type, but a setter
// need not store what it was given.
const celsius = {
  get reading(): string | number { return 21; },
  set reading(v: string | number) { console.log('ignored', v); },
};
celsius.reading = 'warm'; // rejected here: TS2904
console.log(celsius.reading.toUpperCase()); // rejected here: TS2339
