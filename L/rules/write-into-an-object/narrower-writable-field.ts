// rejected sound code: A record narrows a field the type it is viewed as declares writable: through the wider type,
// the name could be set to any string. The fix in our model keeps `name` a string and carries the kind in a field of
// its own.
const failure: { name: 'PermanentFailure'; message: string } = { name: 'PermanentFailure', message: 'x' };
const asError: { name: string; message: string } = failure; // rejected here: TS2890
console.log(asError.name);
