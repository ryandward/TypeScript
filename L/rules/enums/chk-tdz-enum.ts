// witness: A function called before an enum declaration has run reads the enum, which is still undefined.
const picked: Color = pick(); // rejected here: TS2912
function pick(): Color {
  return Color.Red;
}
enum Color { Red = "red", Green = "green" } // rejected here: TS2907
console.log(picked, Color.Green);
