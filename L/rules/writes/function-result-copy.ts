// control: slice() returns a new array, and a list of literals passed where a list of a wider type is taken. With
// nothing written, a wider name is harmless.
const MIGRATIONS: readonly 'dist/migrations/*.js'[] = ['dist/migrations/*.js'];
function configure(migrations: (string | Function)[]): number { return migrations.length; }
console.log(configure(MIGRATIONS.slice()));
