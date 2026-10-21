// witness: BivariantCallback mode: when the target is a method, callback parameters are related with
// their RETURN types compared in both directions.
interface Runner { run(cb: () => string | number): string }
const impl = { run: (cb: () => string): string => cb().toUpperCase() };
const runner: Runner = impl; // rejected here: TS2322
console.log(runner.run(() => 5));
