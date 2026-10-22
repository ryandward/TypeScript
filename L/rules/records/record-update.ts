// rejected sound code: The copy names both of User's properties after the spread, so whatever user hides, the copy
// holds a string at name and a number at age; but a spread copies whatever its value holds, and L has none.
type User = { readonly name: string; readonly age: number };
const user: User = { name: 'n', age: 1 };
const older: User = { ...user, name: user.name, age: user.age + 1 }; // rejected here: TS2926
console.log(older.age);
