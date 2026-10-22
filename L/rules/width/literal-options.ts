// control: An empty object literal passed where every field is optional, and a value of the same type passed on.
type Options = { readonly verbose?: boolean; readonly depth?: number };
const describe = (o: Options): string => `${o.verbose ?? false} ${o.depth ?? 0}`;
const defaults: Options = {};
console.log(describe({}), describe(defaults), describe({ depth: 2 }));
