// A counting loop is safe, but it reassigns its counter on every step. In L a run of numbers is a value, as in
// Array.from({ length: 3 }, (_, i) => i).
for (let i = 0; i < 3; i++) console.log(i); // rejected here: TS2893
