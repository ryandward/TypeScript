// control: A library types its argument as a mapped copy of an entity, as TypeORM's update does, which turns every
// method of a Date into a property. With nothing written, a Date passes.
type QueryDeepPartial<T> = { [P in keyof T]?: QueryDeepPartial<T[P]> | (() => string) };
function update(changes: QueryDeepPartial<{ updatedAt: Date }>): number { return Object.keys(changes).length; }
const touch = (updatedAt: Date): number => update({ updatedAt });
console.log(typeof touch);
