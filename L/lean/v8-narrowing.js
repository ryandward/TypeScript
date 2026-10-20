// The V8 behaviour the narrowing forms in Top.lean model. Run with `node v8-narrowing.js`.
const show = (label, f) => { try { console.log(label.padEnd(44), JSON.stringify(f())); } catch (e) { console.log(label.padEnd(44), `${e.constructor.name}: ${e.message}`); } };
const arrow = () => 1;
class C {}
const values = { '{}': {}, '[]': [], 'null': null, 'undefined': undefined, '42': 42, '"s"': 's', 'true': true, '() => 1': arrow, 'class C {}': C };
for (const [k, v] of Object.entries(values)) {
  show(`plain object test on ${k}`, () => typeof v === 'object' && v !== null && !Array.isArray(v));
  show(`Array.isArray(${k})`, () => Array.isArray(v));
  show(`typeof ${k} === "function"`, () => typeof v === 'function');
  show(`"l" in ${k}`, () => 'l' in v);
}
show('"l" in { l: 1 }', () => 'l' in { l: 1 });
show('"toString" in {}', () => 'toString' in {});
show('"toString" in JSON.parse("{}")', () => 'toString' in JSON.parse('{}'));
show('Object.prototype\'s string keys', () => Object.getOwnPropertyNames(Object.prototype).sort());
show('({ l: 1, l: "x" }).l', () => ({ l: 1, l: 'x' }).l);
show('calling class C {}', () => C());
show('calling () => 1', () => arrow());
