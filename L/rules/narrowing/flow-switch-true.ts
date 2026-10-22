// witness: switch (true) narrows later clauses by `narrowType(clause, assumeTrue=false)`, i.e. by
// truthiness, but a clause is skipped whenever its value is not === true, truthy or not.
type Tag = { readonly label: string };
const classify = (x: true | string | Tag): string => {
  switch (true) {
    case x:
      return 'exactly true';
    default:
      return x.toUpperCase(); // rejected here: TS2339
  }
};
const t: Tag = { label: 'l' };
console.log(classify(true), classify(t));
