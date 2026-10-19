// A call on any, with no property read: the checker resolves value() to a signature that takes anything and
// returns any, and 42 is not a function.
const value: any = 42;
value();
