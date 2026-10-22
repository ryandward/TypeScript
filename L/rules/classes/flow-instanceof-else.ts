// witness: instanceof false branch: getNarrowedTypeWorker(checkDerived) drops every constituent
// derived from the class, but a structurally typed value of the class type need not be an instance.
class Cat { meow(): string { return 'meow'; } } // rejected here: TS2902
class Dog { bark(): string { return 'woof'; } } // rejected here: TS2902

const speak = (pet: Cat | Dog): string => (pet instanceof Dog ? pet.bark() : pet.meow()); // rejected here: TS2339

const fakeDog: Dog = { bark: () => 'woof' };
console.log(speak(fakeDog), speak(new Cat()));
