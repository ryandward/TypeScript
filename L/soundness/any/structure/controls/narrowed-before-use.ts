// A check that decides what the value is: typeof narrows any to string, and the narrowed value has length.
const value: any = 'text';
console.log(typeof value === 'string' ? value.length : 0);
