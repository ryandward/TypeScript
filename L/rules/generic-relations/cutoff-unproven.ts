// rejected sound code: The comparison is cut off before it is proven. B and C never read T, so every B and every
// C is the same infinite chain of x, but each level instantiates both deeper and with different type
// arguments; and a chain of six aliased boxes is finite, but its instantiations nest the way an infinite type's do.
interface A<T> { readonly x: T }
interface B<T> extends A<B<B<B<T>>>> {}
interface C<T> extends A<C<C<C<T>>>> {}
const asC = (b: B<string>): C<string> => b; // rejected here: TS2925
interface Box<T> { readonly value: T }
type RecBox<T> = T | Box<RecBox<T>>;
type T1 = Box<string>;
type T2 = Box<T1>;
type T3 = Box<T2>;
type T4 = Box<T3>;
type T5 = Box<T4>;
type T6 = Box<T5>;
const unbox = (b: T6): RecBox<string> => b; // rejected here: TS2925
console.log(typeof asC, typeof unbox);
