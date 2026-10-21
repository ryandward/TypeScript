// control: typeof narrows a void result as it narrows unknown: if typeof says string, the value is a string.
const pick = (flag: boolean): string | void => (flag ? 'a' : undefined);
const picked = pick(true);
console.log(typeof picked === 'string' ? picked.toUpperCase() : 'none');
