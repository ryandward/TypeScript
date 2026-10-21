// witness: A function called before an enum declaration has run reads the enum, which is still undefined.
const picked: Color = pick();
function pick(): Color {
  return Color.Red;
}
enum Color { Red = "red", Green = "green" }
console.log(picked, Color.Green);
