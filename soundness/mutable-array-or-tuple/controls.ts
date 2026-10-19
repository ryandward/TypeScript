// Programs the mutable-array-or-tuple decision must keep accepting. Each runs without throwing.

// A library's maybe-missing list, named with exactly the type it was given: nothing is related and
// nothing is written. (The shape of TypeScript's symbol.declarations.)
interface Declaration { readonly name: string }
interface LibrarySymbol { readonly declarations?: Declaration[] }
function declarationsOf(symbol: LibrarySymbol): readonly Declaration[] {
  const ds = symbol.declarations;
  if (ds === undefined) return [];
  return ds;
}

// A readonly array widened: the wider name has no position to store through.
function readonlyWidened(): string {
  const strings: readonly string[] = ['a'];
  const wide: readonly (string | number)[] = strings;
  return String(wide.length) + strings[0];
}

// A mutable array viewed as readonly: the write capability is dropped.
function mutableAsReadonly(): number {
  const strings: string[] = ['a'];
  const view: readonly (string | number)[] = strings;
  return view.length;
}

// The same element type: nothing is widened.
function sameElementType(): string {
  const a: string[] = ['a'];
  const b: string[] = a;
  b.push('b');
  return a.join(',');
}

// A fresh array literal given a wider type: no narrower name exists to break.
function freshLiteral(): string {
  const xs: (string | number)[] = ['a'];
  xs.push(1);
  return xs.join(',');
}

// A fresh copy given a wider type: also no narrower name.
function freshCopy(strings: string[]): string {
  const copy: (string | number)[] = [...strings];
  copy.push(1);
  return copy.join(',');
}

// A readonly tuple widened.
function readonlyTuple(): string | number {
  const pair: readonly [string] = ['a'];
  const wide: readonly [string | number] = pair;
  return wide[0];
}

// A library callback whose parameter is a mutable array, as matchAll hands it over.
function matchAllCallback(text: string): string {
  return Array.from(text.matchAll(/\w+/g), (m) => m[0]).join(',');
}

console.log(declarationsOf({ declarations: [{ name: 'x' }] }).length, readonlyWidened(), mutableAsReadonly(),
  sameElementType(), freshLiteral(), freshCopy(['a']), readonlyTuple(), matchAllCallback('a b'));
