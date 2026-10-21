// witness: A function called before a class declaration has run constructs the class in its temporal dead zone.
const made: Widget = build();
function build(): Widget {
  return new Widget("a");
}
class Widget {
  constructor(readonly label: string) {}
}
console.log(made.label);
