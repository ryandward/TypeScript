// witness: An object literal's __proto__: value sets the prototype and makes no own property, but the checker types
// it as a property holding the value.
const tagged = { __proto__: 'label', size: 1 };
// Runtime: TypeError: tagged.__proto__.toUpperCase is not a function
console.log(tagged.__proto__.toUpperCase());
