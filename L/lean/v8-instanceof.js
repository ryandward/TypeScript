const show = (label, f) => { try { console.log(label.padEnd(36), String(f())); } catch (e) { console.log(label.padEnd(36), "TypeError:", e.message); } };
const make = () => 1;
class C {}
show("null instanceof (() => 1)", () => null instanceof make);
show("1 instanceof (() => 1)", () => 1 instanceof make);
show("({}) instanceof (() => 1)", () => ({}) instanceof make);
show("[] instanceof (() => 1)", () => [] instanceof make);
show("(() => 2) instanceof (() => 1)", () => (() => 2) instanceof make);
show("null instanceof 42", () => null instanceof 42);
show("({}) instanceof 42", () => ({}) instanceof 42);
show("null instanceof class {}", () => null instanceof C);
show("({}) instanceof class {}", () => ({}) instanceof C);
show("new C() instanceof class {}", () => new C() instanceof C);
