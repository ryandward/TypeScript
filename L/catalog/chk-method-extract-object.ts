// witness: An object-literal method is taken off its object by destructuring and called alone, so this is
// undefined.
const greeter = {
  name: "ada",
  greet(): string {
    return this.name.toUpperCase();
  },
};
const { greet } = greeter;
console.log(greet());
