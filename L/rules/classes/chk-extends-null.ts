// witness: A class may extend null, and constructing it throws, since there is no base constructor for it to call.
class Bare extends null {} // rejected here: TS2902
console.log(new Bare());
