// witness: Measuring P first, the comparison reaches Q<T> and measures Q while P's own measurement is under way. Q's
// p: P<Box<T>> relates through P's assumed variance, covariant while P is tested for covariance, so Q is measured
// covariant and kept, though P turns out contravariant and Q with it. A Q of strings then passes as a Q of anything.
interface Box<T> { readonly v: T }
interface P<T> { readonly q: Q<T> | null; readonly g: (x: T) => string }
interface Q<T> { readonly p: P<Box<T>> }
const shout: P<Box<string>> = { q: null, g: (x) => x.v.toUpperCase() };
const narrow: P<Box<'a'>> = shout;
const qs: Q<string> = { p: shout };
const qu: Q<unknown> = qs; // rejected here: TS2322
console.log(narrow.q, qu.p.g({ v: 42 }));
