// A fresh object literal given a wider type: no narrower name exists to break.
const wide: { value: string | number } = { value: 'a' };
wide.value = 1;
console.log(wide.value);
