// control: Conditional types whose check types are the same relate by their branches, and a value is a T[K] where the
// object isn't generic and only the key is.
type Pick1<T> = [T] extends [string] ? number : string;
const same = <A,>(x: Pick1<A>): Pick1<A> => x;
type Row = { readonly a: string; readonly b: string };
const put = <K extends keyof Row>(k: K): Row[K] => 'x';
console.log(same<string>(1), put('a'));
