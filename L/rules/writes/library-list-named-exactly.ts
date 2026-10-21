// control: A library's maybe-missing list, named with exactly the type it was given: nothing is related and nothing
// is written. (The shape of TypeScript's symbol.declarations.)
interface Declaration { readonly name: string }
interface LibrarySymbol { readonly declarations?: Declaration[] }
function declarationsOf(symbol: LibrarySymbol): readonly Declaration[] {
  const ds = symbol.declarations;
  if (ds === undefined) return [];
  return ds;
}
console.log(declarationsOf({ declarations: [{ name: 'x' }] }).length);
