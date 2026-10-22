// rejected sound code: The comparison is cut off before it is proven. B and C never read T, so every B and every C is
// the same infinite chain of x, but each level instantiates both deeper and with different type arguments, so no
// pair repeats and the two families never meet with the same arguments.
interface A<T> { readonly x: T }
interface B<T> extends A<B<B<B<T>>>> {}
interface C<T> extends A<C<C<C<T>>>> {}
const asC = (b: B<string>): C<string> => b; // rejected here: TS2925
console.log(typeof asC);
