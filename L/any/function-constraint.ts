// control: any in a constraint only bounds F: no value of type any flows anywhere, so nothing unchecked happens.
const keep = <F extends (...args: any[]) => any>(f: F): F => f;
console.log(keep((n: number) => n + 1)(1));
