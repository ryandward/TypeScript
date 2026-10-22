// rejected sound code: A __proto__ key of null makes an object with no prototype, which can't go wrong while the
// program reads only its own fields, but L takes no __proto__ key.
const bag = { __proto__: null, size: 1 }; // rejected here: TS2914
console.log(bag.size);
