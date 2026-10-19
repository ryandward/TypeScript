// control: A value whose type isn't known yet is unknown, and it can only be used once a check decides what it is.
const value: unknown = JSON.parse('42');
console.log(typeof value === 'number' ? value.toFixed() : 'not a number');
