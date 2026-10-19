// A subclass narrows a field its base declares writable: through the base type, the name could be set to
// any string. The fix in our model keeps `name` a string and carries the kind in a field of its own.
class PermanentFailure extends Error { override name: 'PermanentFailure' = 'PermanentFailure'; }
const asError: Error = new PermanentFailure('x'); // rejected here
console.log(asError.name);
