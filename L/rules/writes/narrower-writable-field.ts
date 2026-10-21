// control: A record whose field is narrower than the writable field of the type it is viewed as. With nothing
// written, the wider name is harmless.
const failure: { name: 'PermanentFailure'; message: string } = { name: 'PermanentFailure', message: 'x' };
const asError: { name: string; message: string } = failure;
console.log(asError.name);
