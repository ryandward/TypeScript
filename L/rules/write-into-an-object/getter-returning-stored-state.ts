// rejected sound code: This getter always returns the same value, so narrowing it would have been safe here. But a
// getter is a call, and nothing in its type says two reads return the same thing.
const holder = { get value(): string | number { return 'a'; } };
if (typeof holder.value === 'string') console.log(holder.value.toUpperCase()); // rejected here: TS2339 on type 'string | number'
