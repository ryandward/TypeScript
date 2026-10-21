// witness: structuredTypeRelatedToWorker: when the variance check fails but the target has a void argument for a
// covariant type parameter (hasCovariantVoidArgument), it falls back to a structural check, where the
// void return shortcut accepts Getter<number> as Getter<void>.
interface Getter<T> { get(): T }
const numbers: Getter<number> = { get: () => 42 };
const voided: Getter<void> = numbers;
const maybeText: Getter<string | void> = voided;
const v = maybeText.get();
console.log(typeof v !== 'undefined' ? v.toUpperCase() : 'none'); // rejected here: TS2339
