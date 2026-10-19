// A library types its argument as a mapped copy of an entity, as TypeORM's update does, which turns every
// method of a Date into a writable property, so passing a Date is rejected. The library's contract forces
// this relation: by L's boundary rule the agent stops and reports it.
type QueryDeepPartial<T> = { [P in keyof T]?: QueryDeepPartial<T[P]> | (() => string) };
function update(changes: QueryDeepPartial<{ updatedAt: Date }>): number { return Object.keys(changes).length; }
const updatedAt = new Date();
console.log(update({ updatedAt })); // rejected here
