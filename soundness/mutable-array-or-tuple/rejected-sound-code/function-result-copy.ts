// slice() returns a new array, but the checker only sees a function result, which another name may hold.
// The fix declares the source with the element type its consumer takes.
const MIGRATIONS: readonly 'dist/migrations/*.js'[] = ['dist/migrations/*.js'];
function configure(migrations: (string | Function)[]): number { return migrations.length; }
console.log(configure(MIGRATIONS.slice())); // rejected here
