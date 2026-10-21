// witness: new Array(n) is any[], and all holes; a new-expression is never checked as a read of any.
const slots: readonly string[] = new Array(3); // rejected here: TS2351
for (const slot of slots) console.log(slot.toUpperCase());
