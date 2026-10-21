// witness: narrowTypeByOptionalChainContainment removes null/undefined from o in the equal branch of
// `o?.x === w` when w's type has no Undefined flag. `void` has its own flag, so a
// `number | void` value that is undefined (as void values normally are) matches o?.x on a nullish o.
type Box = { readonly x: number };
const noNumber: () => number | void = () => { console.log('no number'); };
const noBox: () => Box | void = () => { console.log('no box'); };
const read = (o: Box | void, w: number | void): number => (o?.x === w ? o.x : -1);
console.log(read(noBox(), noNumber()));
