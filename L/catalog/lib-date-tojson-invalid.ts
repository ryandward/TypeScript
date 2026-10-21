// witness: Date.prototype.toJSON is declared to return string, but returns null for an invalid date.
const when: Date = new Date('not a date');
const stamp: string = when.toJSON();
console.log(stamp.length);
