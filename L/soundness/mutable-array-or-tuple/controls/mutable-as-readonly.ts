// A mutable array viewed as readonly: the write capability is dropped.
const strings: string[] = ['a'];
const view: readonly (string | number)[] = strings;
console.log(view.length);
