// control: Relations through recursive types that hold for every instantiation: a regular recursive type, whose
// comparison comes back to a pair it is already comparing; a Set viewed as a ReadonlySet of the same strings, whose
// union methods nest the comparison deeper until the two generic types are related as families; a recursive
// interface measured covariant through its own reference; and a Promise, which the library declares covariant.
type Tree<T> = { readonly value: T; readonly children: readonly Tree<T>[] };
interface Stream<T> { readonly head: T; readonly rest: () => Stream<T> }
const leaf: Tree<'a'> = { value: 'a', children: [] };
const tree: Tree<string> = { value: 'root', children: [leaf] };
const ones = (): Stream<'1'> => ({ head: '1', rest: ones });
const stream: Stream<string> = ones();
const set: ReadonlySet<string> = new Set(['x']);
const later: Promise<string> = Promise.resolve<'p'>('p');
console.log(tree.children.length, stream.rest().head, set.size, typeof later);
