// rejected sound code: eval runs code from a string, and Intl reads the machine's locale. Neither can go wrong,
// but the core performs no effects, so the library declares neither.
console.log(eval('1 + 1')); // rejected here: TS2304
console.log(new Intl.NumberFormat('en').format(1)); // rejected here: TS2304
