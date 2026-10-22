// rejected sound code: The measurement assumes one variance at a time. G reads T only through G itself, so every
// G is the same infinite chain of x and G is independent of T. Assuming G covariant, G<G<Sub>> relates to
// G<G<Super>>, so G is covariant; assuming it contravariant, G<G<Super>> to G<G<Sub>> needs G<Sub> to G<Super>,
// which contravariance refuses, so G isn't contravariant, and D<string> as a G<D<string>> needs string as a D<string>.
interface G<T> { readonly x: G<G<T>> }
interface D<T> { readonly x: G<G<T>> }
const asG = (d: D<string>): G<D<string>> => d; // rejected here: TS2322
console.log(typeof asG);
