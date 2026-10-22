// witness: Reflect.construct with a newTarget builds the object on another constructor's prototype, so it passes
// instanceof Set with none of a Set's internal state.
const s: unknown = Reflect.construct(Object, [], Set); // rejected here: TS2550
console.log(s instanceof Set ? s.size : 0);
