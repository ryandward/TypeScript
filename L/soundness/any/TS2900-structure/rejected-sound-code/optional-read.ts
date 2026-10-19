// An optional read never throws: null?.length is undefined. But any reads as unknown, and the checker rejects ?.
// on unknown as it rejects every read, so the value has to be decided first.
const value: any = null;
const length = value?.length; // rejected here: TS2900
console.log(length);
