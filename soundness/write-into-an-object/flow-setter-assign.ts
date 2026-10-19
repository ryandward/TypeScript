// Assignment narrowing of a property reads the assigned value as the new type, but a setter
// need not store what it was given.
class Celsius {
  readonly store = new Map<string, string>();
  get reading(): string | number { return this.store.size; }
  set reading(v: string | number) { this.store.set('v', String(v)); }
}
const c = new Celsius();
c.reading = 'warm';
console.log(c.reading.toUpperCase());
