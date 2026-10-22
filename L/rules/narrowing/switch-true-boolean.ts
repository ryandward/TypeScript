// control: A switch (true) clause of type boolean is skipped exactly when it is false, so later clauses narrow.
const show = (x: string | number): string => {
  switch (true) {
    case typeof x === 'string':
      return x.toUpperCase();
    default:
      return x.toFixed(1);
  }
};
console.log(show('a'), show(1));
