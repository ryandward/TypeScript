// witness: stringify's replacer is (this: any, key: string, value: any) => any; the first value is the root.
const payload = { title: 'x' };
const text: string | undefined = JSON.stringify(payload, (key: string, value: string) => key + value.toUpperCase()); // rejected here: TS2920
console.log(text);
