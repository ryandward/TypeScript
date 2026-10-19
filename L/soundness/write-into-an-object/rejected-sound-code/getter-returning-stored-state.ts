// This getter does return stored state, so narrowing it would have been safe here. But a getter is a call,
// and nothing in its type says two reads return the same thing.
class Holder {
  #value: string | number = 'a';
  get value(): string | number { return this.#value; }
}
const h = new Holder();
if (typeof h.value === 'string') console.log(h.value.toUpperCase()); // rejected here: TS2339 on type 'string | number'
