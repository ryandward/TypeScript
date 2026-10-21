// witness: structuredClone<T>(value: T): T, but class instances come back as plain objects.
class Money {
  constructor(readonly cents: number) {}
  format(): string { return (this.cents / 100).toFixed(2); }
}
const price: Money = new Money(250);
const saved: Money = structuredClone(price);
console.log(saved.format());
