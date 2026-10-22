// control: A computed or shorthand __proto__ key makes an own property, as its type says.
const key = '__proto__';
const computed = { [key]: 'label' };
const __proto__ = 'label';
const shorthand = { __proto__ };
console.log(computed.__proto__.toUpperCase(), shorthand.__proto__.toUpperCase());
