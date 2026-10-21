// witness: An interface merged into a class declares a method the class never implements.
interface Account {
  close(): string;
}
class Account {
  constructor(readonly id: string) {}
}
console.log(new Account("a").close().toUpperCase());
