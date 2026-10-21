// control: A fresh array literal whose expected type is a union with one mutable array in it: nothing else holds it.
type MixedList<T> = T[] | { [key: string]: T };
const migrations: MixedList<string | Function> | undefined = ['dist/migrations/*.js'];
console.log(Array.isArray(migrations));
